package com.tcc.art.service;

import com.tcc.art.dto.request.*;
import com.tcc.art.dto.response.AuthResponse;
import com.tcc.art.dto.response.EngineerResponse;
import com.tcc.art.exception.BusinessRuleException;
import com.tcc.art.exception.ResourceNotFoundException;
import com.tcc.art.model.Engineer;
import com.tcc.art.model.PasswordResetToken;
import com.tcc.art.repository.EngineerRepository;
import com.tcc.art.repository.PasswordResetTokenRepository;
import com.tcc.art.security.JwtTokenProvider;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class AuthService {

    private static final Logger log = LoggerFactory.getLogger(AuthService.class);

    private final EngineerRepository engineerRepository;
    private final PasswordResetTokenRepository resetTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;
    private final JavaMailSender mailSender;

    public AuthService(EngineerRepository engineerRepository,
                       PasswordResetTokenRepository resetTokenRepository,
                       PasswordEncoder passwordEncoder,
                       JwtTokenProvider jwtTokenProvider,
                       JavaMailSender mailSender) {
        this.engineerRepository = engineerRepository;
        this.resetTokenRepository = resetTokenRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtTokenProvider = jwtTokenProvider;
        this.mailSender = mailSender;
    }

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (engineerRepository.existsByEmail(request.email())) {
            throw new BusinessRuleException("Email já está em uso.");
        }
        if (engineerRepository.existsByUsername(request.username())) {
            throw new BusinessRuleException("Username já está em uso.");
        }

        Engineer engineer = new Engineer();
        engineer.setName(request.name());
        engineer.setEmail(request.email().toLowerCase());
        engineer.setUsername(request.username());
        engineer.setPasswordHash(passwordEncoder.encode(request.password()));
        engineerRepository.save(engineer);
        log.info("Novo engenheiro registrado: id={}, email={}", engineer.getId(), engineer.getEmail());

        String token = jwtTokenProvider.generateToken(engineer.getId());
        return new AuthResponse(token, EngineerResponse.from(engineer));
    }

    @Transactional(readOnly = true)
    public AuthResponse login(LoginRequest request) {
        Engineer engineer = engineerRepository
                .findByEmailOrUsername(request.emailOrUsername(), request.emailOrUsername())
                .orElseThrow(() -> {
                    log.warn("Tentativa de login com credencial inexistente: {}", request.emailOrUsername());
                    return new BadCredentialsException("Credenciais inválidas.");
                });

        if (!passwordEncoder.matches(request.password(), engineer.getPasswordHash())) {
            log.warn("Senha incorreta para engenheiro id={}", engineer.getId());
            throw new BadCredentialsException("Credenciais inválidas.");
        }

        log.info("Login bem-sucedido: engenheiro id={}", engineer.getId());
        String token = jwtTokenProvider.generateToken(engineer.getId());
        return new AuthResponse(token, EngineerResponse.from(engineer));
    }

    @Transactional
    public void forgotPassword(ForgotPasswordRequest request) {
        Engineer engineer = engineerRepository.findByEmail(request.email().toLowerCase())
                .orElse(null);
        // Silently ignore if not found (prevents email enumeration)
        if (engineer == null) return;

        PasswordResetToken resetToken = new PasswordResetToken();
        resetToken.setEngineer(engineer);
        resetToken.setToken(UUID.randomUUID().toString());
        resetToken.setExpiresAt(LocalDateTime.now().plusHours(1));
        resetTokenRepository.save(resetToken);

        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(engineer.getEmail());
            message.setSubject("Redefinição de senha — ART Analyzer");
            message.setText("Para redefinir sua senha, use o token:\n\n" + resetToken.getToken()
                    + "\n\nEste token expira em 1 hora.");
            mailSender.send(message);
            log.info("E-mail de redefinição de senha enviado para: {}", engineer.getEmail());
        } catch (Exception e) {
            log.error("Falha ao enviar e-mail de redefinição para {}: {}", engineer.getEmail(), e.getMessage(), e);
        }
    }

    @Transactional
    public void resetPassword(ResetPasswordRequest request) {
        PasswordResetToken resetToken = resetTokenRepository.findByToken(request.token())
                .orElseThrow(() -> new ResourceNotFoundException("Token inválido ou expirado."));

        if (resetToken.isUsed() || resetToken.getExpiresAt().isBefore(LocalDateTime.now())) {
            throw new BusinessRuleException("Token inválido ou expirado.");
        }

        Engineer engineer = resetToken.getEngineer();
        engineer.setPasswordHash(passwordEncoder.encode(request.newPassword()));
        engineerRepository.save(engineer);

        resetToken.setUsed(true);
        resetTokenRepository.save(resetToken);
    }
}
