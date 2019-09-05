package com.warn.dao;

import com.warn.dto.PageHelper;
import com.warn.entity.Account;
import com.warn.entity.User;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * Created by netlab606 on 2017/5/22.
 */
public interface LouDao {

//    void addUser_Role(@Param("uid") Integer uid, @Param("rid") Integer rid);

    int is_exist(String louName);
    int getLouId(String louName);

    void addLou(double jd,double jd2,double jd3,double wd,String louName);
}
