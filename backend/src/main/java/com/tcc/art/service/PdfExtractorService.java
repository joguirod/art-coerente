package com.tcc.art.service;

import com.tcc.art.dto.response.PdfExtractionResponse;
import org.apache.pdfbox.Loader;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripperByArea;
import org.apache.pdfbox.text.PDFTextStripper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.awt.Rectangle;
import java.io.IOException;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class PdfExtractorService {

    private static final Logger log = LoggerFactory.getLogger(PdfExtractorService.class);

    private static final DateTimeFormatter DATE_FORMAT = DateTimeFormatter.ofPattern("dd/MM/yyyy");

    /**
     * Extracts fields from a CREA-PI ART PDF.
     * Uses text extraction with regex patterns to identify fields.
     * Returns whatever could be extracted; missing fields are listed in missingFields.
     */
    public PdfExtractionResponse extract(MultipartFile file) {
        String artNumber = null;
        String description = null;
        String location = null;
        String contractorName = null;
        LocalDate startDate = null;
        LocalDate endDate = null;
        List<String> missingFields = new ArrayList<>();

        try (PDDocument document = Loader.loadPDF(file.getBytes())) {
            PDFTextStripper stripper = new PDFTextStripper();
            String fullText = stripper.getText(document);

            artNumber = extractField(fullText, "(?i)n[uú]mero\\s*(?:da\\s*)?art[:\\s]+([\\d.-]+)");
            description = extractField(fullText, "(?i)(?:descri[çc][aã]o\\s*(?:da\\s*obra)?|objeto)[:\\s]+([^\\n]{10,500})");
            location = extractField(fullText, "(?i)(?:endere[çc]o|local(?:iza[çc][aã]o)?)[:\\s]+([^\\n]{5,255})");
            contractorName = extractField(fullText, "(?i)(?:contratante|empregador)[:\\s]+([^\\n]{3,255})");

            String startStr = extractField(fullText, "(?i)(?:data\\s*(?:de\\s*)?in[íi]cio|in[íi]cio)[:\\s]+(\\d{2}/\\d{2}/\\d{4})");
            String endStr = extractField(fullText, "(?i)(?:data\\s*(?:de\\s*)?t[eé]rmino|t[eé]rmino|conclus[aã]o)[:\\s]+(\\d{2}/\\d{2}/\\d{4})");

            if (startStr != null) {
                try { startDate = LocalDate.parse(startStr, DATE_FORMAT); } catch (Exception ignored) {}
            }
            if (endStr != null) {
                try { endDate = LocalDate.parse(endStr, DATE_FORMAT); } catch (Exception ignored) {}
            }
        } catch (IOException e) {
            log.error("Falha ao ler PDF '{}': {}", file.getOriginalFilename(), e.getMessage(), e);
        }

        if (artNumber == null) missingFields.add("artNumber");
        if (description == null) missingFields.add("description");
        if (location == null) missingFields.add("location");
        if (contractorName == null) missingFields.add("contractorName");
        if (startDate == null) missingFields.add("startDate");
        if (endDate == null) missingFields.add("endDate");

        return new PdfExtractionResponse(artNumber, description, location, contractorName, startDate, endDate, missingFields);
    }

    private String extractField(String text, String regex) {
        Pattern p = Pattern.compile(regex, Pattern.MULTILINE);
        Matcher m = p.matcher(text);
        if (m.find()) {
            String value = m.group(1).trim();
            return value.isEmpty() ? null : value;
        }
        return null;
    }
}
