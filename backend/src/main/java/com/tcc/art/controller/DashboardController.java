package com.tcc.art.controller;

import com.tcc.art.dto.response.DashboardSummaryResponse;
import com.tcc.art.security.AuthenticatedEngineer;
import com.tcc.art.service.DashboardService;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final DashboardService dashboardService;

    public DashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    @GetMapping("/summary")
    public DashboardSummaryResponse getSummary(@AuthenticationPrincipal UserDetails userDetails) {
        return dashboardService.getSummary(AuthenticatedEngineer.getId(userDetails));
    }
}
