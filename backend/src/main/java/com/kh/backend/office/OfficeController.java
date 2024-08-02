package com.kh.backend.office;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class OfficeController {
    @Autowired
    private OfficeService officeService;

    @GetMapping("/admin/notavailability")
    public List<Office> getOfficeNotAvailability(
            @RequestParam(value = "page", defaultValue = "1") int page,
            @RequestParam(value = "size", defaultValue = "5") int size) {
        return officeService.getOfficeNotAvailability(page, size);
    }
}