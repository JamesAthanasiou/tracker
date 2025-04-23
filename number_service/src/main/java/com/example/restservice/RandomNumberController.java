package com.example.restservice;

import java.util.Random;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class RandomNumberController {

    private final Random numberGenerator = new Random();
    
    @GetMapping("/number")
    public Integer getNumber() {
        return numberGenerator.nextInt(10);
    }
}
