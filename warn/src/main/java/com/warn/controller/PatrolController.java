package com.warn.controller;

import com.warn.dto.Result;
import com.warn.entity.AutoValue;
import com.warn.service.PatrolService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import java.io.IOException;
import java.text.ParseException;
import java.util.List;

@Controller
@RequestMapping("/patrol")
public class PatrolController {
    @Autowired
    PatrolService patrolService;

    @RequestMapping(value = "/addRecords",method = RequestMethod.GET)
    @ResponseBody
    public Result addRecords() throws IOException, ParseException {
        patrolService.addPatrolRecords();
        return new Result(true);
    }

    @ResponseBody
    @RequestMapping(value = "/getOldIds",method = RequestMethod.GET)
    public Result getOldIds(){
        List<Integer> oldIds =  patrolService.getOldIds();
        return new Result(true,oldIds);
    }


    @RequestMapping(value = "/checkRecords",method = RequestMethod.GET)
    @ResponseBody
    public Result check(){
        return patrolService.checkRecords();
    }

    @ResponseBody
    @RequestMapping(value = "/getOldStatus",method = RequestMethod.GET)
    public Result getOldStatus(){
        List<AutoValue> oldS = patrolService.getOldsStatus();
        return new Result(true,oldS);

    }


}
