package com.henustudio.biology.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

import javax.servlet.http.HttpServletRequest;

@Controller
public class MainController {

    @GetMapping("/")
    public String index(){

        return "index";
    }

    @GetMapping("/content")
    public String content(){
        return "content";
    }
}
