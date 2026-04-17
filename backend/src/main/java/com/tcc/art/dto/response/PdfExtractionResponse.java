package com.tcc.art.dto.response;

import java.time.LocalDate;
import java.util.List;

public record PdfExtractionResponse(
        String artNumber,
        String description,
        String location,
        String contractorName,
        LocalDate startDate,
        LocalDate endDate,
        List<String> missingFields
) {}
