package com.warn.service.impl;

import com.warn.dao.AccountDao;
import com.warn.dto.DwrData;
import com.warn.dto.PageHelper;
import com.warn.dto.Result;
import com.warn.dto.Warn_all;
import com.warn.dwr.Remote;
import com.warn.entity.Account;
import com.warn.entity.OldMan;
import com.warn.entity.Role;
import com.warn.entity.User;
import com.warn.service.AccountService;
import com.warn.service.AlarmService;
import net.sf.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.servlet.ServletInputStream;
import javax.servlet.http.HttpServletRequest;
import java.util.List;

/**
 * Created by netlab606 on 2017/5/22.
 */
@Service
public class AlarmServiceImpl implements AlarmService {

    @Autowired
    AccountDao accountDao;



    @Override
    @Transactional
    public Result getAlarmForbidden(HttpServletRequest request) {
        try {
            ServletInputStream inputStream = request.getInputStream();
            StringBuffer buffer = new StringBuffer();
            byte[] b = new byte[1024];
            int len = 0;
            while ((len = inputStream.read(b)) != -1) {
                buffer.append(new String(b, 0, len));
            }
            JSONObject json = JSONObject.fromObject(buffer.toString());
//            Warn_all warn_all = (Warn_all) JSONObject.toJavaObject(json,Warn_all.class);
            Warn_all warn_all = (Warn_all)JSONObject.toBean(json,Warn_all.class);
            if(json.get("type")=="warn"){
                //alarmForbidden.setWarnLevel(Integer.parseInt(String.valueOf(json.get("warnLevel"))));
                OldMan oldman=new OldMan();
//                oldman.setOid(json.get("id"));
//                alarmForbidden.setOldMan(json.get("Oldman"));
//                alarmForbidden.setType(json.get("type").toString());
//                alarmForbidden.setTime(json.get("time").toString());
            }
//            alarmForbidden.setLevel(json.get("level").toString());
//            alarmForbidden.setInfo(json.get("info").toString());
//            alarmForbidden.setType(json.get("type").toString());
//            alarmForbidden.setTime(json.get("time").toString());
//            DwrData dwrData = new DwrData();
//            dwrData.setType("alarm_forbidden");
//            dwrData.setAlarmForbidden(alarmForbidden);
//            warnHistoryService.addWarnHistory(dwrData);
            //Remote.noticeNewOrder(dwrData);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return new Result(true);
    }

}
