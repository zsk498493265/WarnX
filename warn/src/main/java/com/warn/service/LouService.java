package com.warn.service;

import com.warn.dto.PageHelper;
import com.warn.entity.Account;

import java.util.List;

/**
 * Created by netlab606 on 2017/5/22.
 */
public interface LouService {

    int is_exist(String louName);

    int getLouId(String louName);

    void addLou(double jd1,double jd2,double jd3,double wd,String louName);

}
