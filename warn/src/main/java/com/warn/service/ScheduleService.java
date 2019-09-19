package com.warn.service;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.text.ParseException;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Service
public class ScheduleService {


    @Autowired
    PatrolService patrolService;

    @Scheduled(cron = "0 0/10 * * * ?")
    //@Scheduled(cron = "0 0 22 1 * ?")
    public void demoSchedule() throws IOException, ParseException {
        patrolService.addPatrolRecords();

    }
}
