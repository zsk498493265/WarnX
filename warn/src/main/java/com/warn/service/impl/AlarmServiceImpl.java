package com.warn.service.impl;

import com.warn.dao.AccountDao;
import com.warn.dto.*;
import com.warn.dwr.Remote;
import com.warn.entity.Account;
import com.warn.entity.OldMan;
import com.warn.entity.Role;
import com.warn.entity.User;
import com.warn.service.AccountService;
import com.warn.service.AlarmService;
import com.warn.service.WarnHistoryService;
import net.sf.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.servlet.ServletInputStream;
import javax.servlet.http.HttpServletRequest;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created by netlab606 on 2017/5/22.
 */
@Service
public class AlarmServiceImpl implements AlarmService {

    @Autowired
    AccountDao accountDao;

    @Autowired
    WarnHistoryService warnHistoryService;




    @Override
    @Transactional
    public Result getAlarmForbidden(HttpServletRequest request) {
        try {
            //编码格式
            request.setCharacterEncoding("GBK");
            ServletInputStream inputStream = request.getInputStream();
            StringBuffer buffer = new StringBuffer();
            byte[] b = new byte[1024];
            int len = 0;
            while ((len = inputStream.read(b)) != -1) {
                buffer.append(new String(b, 0, len));
            }
            JSONObject json = JSONObject.fromObject(buffer.toString());
//            Warn_all warn_all = (Warn_all) JSONObject.toJavaObject(json,Warn_all.class);
            Map<String,Class> classMap=new HashMap<>();
            DwrData warn_all = (DwrData) JSONObject.toBean(json,DwrData.class,classMap);
//            Warn_all warn_all = (Warn_all)JSONObject.toBean(json,Warn_all.class,classMap);
          //  if(json.get("type")=="warn"){
                //alarmForbidden.setWarnLevel(Integer.parseInt(String.valueOf(json.get("warnLevel"))));
                //JSONObject oldman=(JSONObject) json.get("Oldman");
//                oldman.setOid(json.get("id"));
//                alarmForbidden.setOldMan(json.get("Oldman"));
//                alarmForbidden.setType(json.get("type").toString());
//                alarmForbidden.setTime(json.get("time").toString());

            //}
//            alarmForbidden.setLevel(json.get("level").toString());
//            alarmForbidden.setInfo(json.get("info").toString());
//            alarmForbidden.setType(json.get("type").toString());
//            alarmForbidden.setTime(json.get("time").toString());
//            DwrData dwrData = new DwrData();
//            dwrData.setType(warn_all.getType());
//            if(warn_all.getType().equals("warn_light")){
//                Warn_light warn_light=new Warn_light();
//                warn_light.setLight(warn_all.getLight());
//                warn_light.setThreshold_light(warn_all.getThreshold_light());
//                warn_light.setTime(warn_all.getTime());
//                warn_light.setValue(warn_all.getValue());
//                warn_light.setOldMan(warn_all.getOldMan());
//
//                dwrData.setWarn_light(warn_light);
//            }else if(warn_all.getType().equals("warn_wendu")){
//                Warn_wendu warn_wendu=new Warn_wendu();
//                //warn_wendu.setThreshold_wendu(warn_all.getThreshold_wendu());
//                warn_wendu.setWendu(warn_all.getWendu());
//                warn_wendu.setOldMan(warn_all.getOldMan());
//                warn_wendu.setThreshold_wendu(warn_all.getThreshold_wendu());
//                //warn_wendu.setOldMan(warn_all.getOldMan());
//
//                dwrData.setWarn_wendu(warn_wendu);
//            }else if(warn_all.getType().equals("warn_move")||warn_all.getType().equals("warn_position")){
//                Warn warn=new Warn();
//                warn.setWarnLevel(warn_all.getWarnLevel());
//                warn.setNoMoveTime(warn_all.getNoMoveTime());
//                warn.setRoom(warn_all.getRoom());
//                warn.setTime(warn_all.getTime());
//                warn.setInTime(warn_all.getInTime());
//                warn.setTimes(warn_all.getTimes());
//                warn.setFlag(warn_all.getFlag());
//                warn.setOldMan(warn_all.getOldMan());
//
//                dwrData.setWarn(warn);
//            }

            warnHistoryService.addWarnHistory(warn_all);
            Remote.noticeNewOrder2(warn_all);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return new Result(true);
    }

}
