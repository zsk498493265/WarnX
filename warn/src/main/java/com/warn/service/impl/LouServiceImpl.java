package com.warn.service.impl;

import com.warn.dao.AccountDao;
import com.warn.dao.LouDao;
import com.warn.dto.PageHelper;
import com.warn.entity.Account;
import com.warn.entity.Role;
import com.warn.entity.User;
import com.warn.service.AccountService;
import com.warn.service.LouService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Created by netlab606 on 2017/5/22.
 */
@Service
public class LouServiceImpl implements LouService {

    @Autowired
    LouDao louDao;

    @Override
    public int is_exist(String louName) {
        return louDao.is_exist(louName);
    }

    @Override
    public int getLouId(String louName) {
        return louDao.getLouId(louName);
    }

    @Transactional
    @Override
    public void addLou(double jd1,double jd2,double jd3,double wd,String louName) {

        louDao.addLou(jd1,jd2,jd3,wd,louName);
    }


}
