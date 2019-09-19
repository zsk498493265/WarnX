package com.warn.service.impl;

import com.warn.controller.SystemController;
import com.warn.dao.*;
import com.warn.entity.OldMan;
import com.warn.dto.PageHelper;
import com.warn.entity.Room;
import com.warn.entity.Worker;
import com.warn.entity.Xungeng;
import com.warn.service.DataService;
import com.warn.util.StaticVal;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.TimeZone;

/**
 * Created by admin on 2017/4/5.
 */
@Service
public class DataServiceImpl implements DataService{

    @Autowired
    DataDao dataDao;
    @Autowired
    RoomDao roomDao;
    @Autowired
    EquipDao equipDao;
    @Autowired
    ModelDao modelDao;
    @Autowired
    ThresholdDao thresholdDao;
    @Autowired
    LouDao louDao;


    public Long getDatagridTotal(OldMan oldMan) {
//        if(oldMan.getGatewayID()!=null&&!oldMan.getGatewayID().equals("")){
//            //简单判断 用户输入的是二进制还是十进制   十进制1-16  长度>=4且只有0和1 则判断为二进制
//            if(oldMan.getGatewayID().length()>=4&&isBinary(oldMan.getGatewayID())){
//                //查询以二进制的方式
//                oldMan.setGatewayID(Integer.valueOf(oldMan.getGatewayID(),2).toString());
//            }
//        }
        if(oldMan.getSegment()!=null&&!oldMan.getSegment().equals("")){
            //简单判断 用户输入的是二进制还是十进制   十进制1-16  长度>=4且只有0和1 则判断为二进制
            if(oldMan.getSegment().length()>=4&&isBinary(oldMan.getSegment())){
                //查询以二进制的方式
                oldMan.setSegment(Integer.valueOf(oldMan.getSegment(),2).toString());
            }
        }
        return dataDao.getDatagridTotal(oldMan);
    }

    public Long getDatagridTotal_worker(Worker worker) {
        return dataDao.getDatagridTotal_worker(worker);
    }

    public Long getDatagridTotalNG(OldMan oldMan){
        if(oldMan.getSegment()!=null&&!oldMan.getSegment().equals("")){
            //简单判断 用户输入的是二进制还是十进制   十进制1-16  长度>=4且只有0和1 则判断为二进制
            if(oldMan.getSegment().length()>=4&&isBinary(oldMan.getSegment())){
                //查询以二进制的方式
                oldMan.setSegment(Integer.valueOf(oldMan.getSegment(),2).toString());
            }
        }
        return dataDao.getDatagridTotalNG(oldMan);
    }

    public List<OldMan> datagridUser(PageHelper page,OldMan oldMan) {
//        if(oldMan.getGatewayID()!=null&&!oldMan.getGatewayID().equals("")){
//            //简单判断 用户输入的是二进制还是十进制   十进制1-16  长度>=4且只有0和1 则判断为二进制
//            if(oldMan.getGatewayID().length()>=4&&isBinary(oldMan.getGatewayID())){
//                //查询以二进制的方式
//                oldMan.setGatewayID(Integer.valueOf(oldMan.getGatewayID(),2).toString());
//            }
//        }
        if(oldMan.getSegment()!=null&&!oldMan.getSegment().equals("")){
            //简单判断 用户输入的是二进制还是十进制   十进制1-16  长度>=4且只有0和1 则判断为二进制
            if(oldMan.getSegment().length()>=4&&isBinary(oldMan.getSegment())){
                //查询以二进制的方式
                oldMan.setSegment(Integer.valueOf(oldMan.getSegment(),2).toString());
            }
        }
        page.setStart((page.getPage() - 1) * page.getRows());
        return dataDao.datagridUser(page,oldMan);
    }

    public List<Worker> datagridUser_worker(PageHelper page,Worker worker) {
//        if(oldMan.getGatewayID()!=null&&!oldMan.getGatewayID().equals("")){
//            //简单判断 用户输入的是二进制还是十进制   十进制1-16  长度>=4且只有0和1 则判断为二进制
//            if(oldMan.getGatewayID().length()>=4&&isBinary(oldMan.getGatewayID())){
//                //查询以二进制的方式
//                oldMan.setGatewayID(Integer.valueOf(oldMan.getGatewayID(),2).toString());
//            }
//        }

        page.setStart((page.getPage() - 1) * page.getRows());
        return dataDao.datagridUser_worker(page,worker);
    }
    public List<OldMan> datagridNGUser(PageHelper page,OldMan oldMan) {
//        if(oldMan.getGatewayID()!=null&&!oldMan.getGatewayID().equals("")){
//            //简单判断 用户输入的是二进制还是十进制   十进制1-16  长度>=4且只有0和1 则判断为二进制
//            if(oldMan.getGatewayID().length()>=4&&isBinary(oldMan.getGatewayID())){
//                //查询以二进制的方式
//                oldMan.setGatewayID(Integer.valueOf(oldMan.getGatewayID(),2).toString());
//            }
//        }
        if(oldMan.getSegment()!=null&&!oldMan.getSegment().equals("")){
            //简单判断 用户输入的是二进制还是十进制   十进制1-16  长度>=4且只有0和1 则判断为二进制
            if(oldMan.getSegment().length()>=4&&isBinary(oldMan.getSegment())){
                //查询以二进制的方式
                oldMan.setSegment(Integer.valueOf(oldMan.getSegment(),2).toString());
            }
        }
        page.setStart((page.getPage() - 1) * page.getRows());
        return dataDao.datagridNGUser(page,oldMan);
    }

    //简单判断是不是二进制数
    private boolean isBinary(String collectId) {
        if(collectId.contains("2")||collectId.contains("3")||collectId.contains("4")||collectId.contains("5")||collectId.contains("6")||collectId.contains("7")||collectId.contains("8")
                ||collectId.contains("9")){
            return false;
        }
        return true;
    }

    @Transactional
    public void addOldman(OldMan oldMan, Integer segmentTwo_Ten) {
//        if(gatewayTwo_Ten.intValue()==2){
//            //添加时，输入的网关是二进制的， 转换成十进制后，再存入数据库
//            oldMan.setGatewayID(Integer.valueOf(oldMan.getGatewayID(),2).toString());
//        }
        if(segmentTwo_Ten.intValue()==2){
            //添加时，输入的网段是二进制的， 转换成十进制后，再存入数据库
            oldMan.setSegment(Integer.valueOf(oldMan.getSegment(),2).toString());
        }
        //获得系统当前时间
        Date d = new Date();
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
        sdf.setTimeZone(TimeZone.getTimeZone("Asia/Shanghai"));
        String dateNowStr = sdf.format(d);
        oldMan.setOldRegtime(dateNowStr);
        int is_exist=louDao.is_exist(oldMan.getOldAddress());
//        oldMan.getRelatives().setOldId(oldMan.getOid());
        if(is_exist>0){
            oldMan.setLouId(louDao.getLouId(oldMan.getOldAddress()));
        }
        else if(is_exist==0){
            double jd1,jd2,jd3,wd;
            jd1=Double.parseDouble(oldMan.getJd());
            wd=Double.parseDouble(oldMan.getWd());
            jd2=jd1+0.0001;
            jd3=jd1+0.0002;
            louDao.addLou(jd1,jd2,jd3,wd,oldMan.getOldAddress());
            oldMan.setLouId(louDao.getLouId(oldMan.getOldAddress()));

        }
        dataDao.addOldman(oldMan);
        oldMan.getRelatives().setOldId(oldMan.getOid());
        dataDao.addRelatives(oldMan.getRelatives());
        thresholdDao.addDoorThresholdByOid(oldMan.getOid());

        //添加该老人的定时器
        StaticVal.oldManTimer.put(oldMan,false);
    }

    @Transactional
    public void addWorker(Worker worker) {

        //获得系统当前时间
        Date d = new Date();
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
        sdf.setTimeZone(TimeZone.getTimeZone("Asia/Shanghai"));
        String dateNowStr = sdf.format(d);
        worker.setOldRegtime(dateNowStr);

        dataDao.addWorker(worker);



    }

    @Transactional
    public void addXungeng(Xungeng xungeng) {


        dataDao.addXungeng(xungeng);



    }

    @Transactional
    public void editOldman(OldMan oldMan, Integer segmentTwo_Ten) {
//        if(gatewayTwo_Ten.intValue()==2){
//            //添加时，输入的网关是二进制的， 转换成十进制后，再存入数据库
//            oldMan.setGatewayID(Integer.valueOf(oldMan.getGatewayID(),2).toString());
//        }
        if(segmentTwo_Ten.intValue()==2){
            //添加时，输入的网段是二进制的， 转换成十进制后，再存入数据库
            oldMan.setSegment(Integer.valueOf(oldMan.getSegment(),2).toString());
        }
        dataDao.editOldman(oldMan);
        oldMan.getRelatives().setOldId(oldMan.getOid());
        dataDao.editRelatives(oldMan.getRelatives());
    }

    @Transactional
    public void deleteOldmanById(Integer oldManId) {
        OldMan oldMan=new OldMan();
        oldMan.setOid(oldManId);
        List<Room> rooms=roomDao.getAllRoomByOldManId(oldManId);
        for(Room room:rooms){
            //停止房间光强的定时器
            if(SensorServiceImpl.lightTimer.get(room)!=null){
                SensorServiceImpl.lightTimer.get(room).shutdown();
                SensorServiceImpl.lightTimer.remove(room);
            }
            thresholdDao.deleteByRoomId(room.getRid());
        }
        //改成了级联操作
//        roomDao.deleteRoomByOldManId(oldManId);
//        dataDao.deleteRelativesByOldManId(oldManId);
        equipDao.deleteOldMan(oldManId);
//        modelDao.deleteByoldId(oldManId);
//        thresholdDao.deleteDoorThresholdByOid(oldManId);
        //顺序不能反 有外键
        dataDao.deleteOldmanById(oldManId);


        //删除该老人的预警开关
        if(StaticVal.oldManTimer.get(oldMan)!=null) {
            if(SensorServiceImpl.timer.get(oldMan)!=null){
                SensorServiceImpl.timer.get(oldMan).shutdown();
                SensorServiceImpl.timer.remove(oldMan);
            }
            if(SensorServiceImpl.timerDoor.get(oldMan)!=null){
                SensorServiceImpl.timerDoor.get(oldMan).shutdown();
                SensorServiceImpl.timerDoor.remove(oldMan);
            }
            if(TimerServiceImpl.databaseTimer.get(oldMan)!=null){
                TimerServiceImpl.databaseTimer.get(oldMan).shutdown();
                TimerServiceImpl.databaseTimer.remove(oldMan);
            }
            StaticVal.oldManTimer.remove(oldMan);
            SystemController.logger.info("预警开关删除");
        }
    }

    @Transactional
    public void deleteWorkerById(Integer id) {
        dataDao.deleteWorkerById(id);

    }

    @Override
    public List<OldMan> getAllOldmanID_Name() {
        return dataDao.getAllOldMan();
    }

    @Override
    public List<OldMan> getOldmanId_NG(){return dataDao.getOldManNG();}

    @Override
    public List<OldMan> datagridUserMap(PageHelper page, OldMan oldMan) {
        page.setStart((page.getPage() - 1) * page.getRows());
        List<OldMan> oldManList=dataDao.datagridUserMap(page,oldMan);
        for(OldMan oldMan1:oldManList){
            oldMan1.setMapAddress(oldMan1.getQuMarker().getqName()+"-"+oldMan1.getJieDaoMarker().getjName()+"-"+oldMan1.getLouMarker().getInfo());
        }
        return oldManList;
    }

    @Override
    public void editOldmanMap(OldMan oldMan) {
        dataDao.editOldmanMap(oldMan);
    }
}
