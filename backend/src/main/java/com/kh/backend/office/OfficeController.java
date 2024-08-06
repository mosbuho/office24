package com.kh.backend.office;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class OfficeController {

    @Autowired
    private OfficeService officeService;

    @GetMapping("/img/{filename:.+}")
    public ResponseEntity<Resource> serveImage(@PathVariable String filename) {
        return officeService.serveImage(filename);
    }
}
