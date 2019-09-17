package com.warn.service;

import com.warn.dto.PageHelper;
import com.warn.dto.Result;
import com.warn.entity.Account;

import javax.servlet.http.HttpServletRequest;
import java.util.List;

/**
 * Created by netlab606 on 2017/5/22.
 */
public interface AlarmService {
   Result getAlarmForbidden(HttpServletRequest request);
}
