package com.syl.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

/**
 * Created by 18236 on 2018/1/7.
 */
@Controller
public class AdminController {

    @GetMapping("/")
    public String index(){
        return "index";
    }
}
