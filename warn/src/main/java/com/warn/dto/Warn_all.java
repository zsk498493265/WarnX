package com.warn.dto;

import com.warn.entity.*;

/**
 * Created by admin on 2017/4/26.
 */
public class Warn_all {
    //warn
    private Integer warnLevel;//报警级别  1表示一级 2表示二级
    private OldMan oldMan;
    private Integer noMoveTime;//到目前为止不动时间的时间  单位分钟
    private String time;//最初不动的时刻
    private Room room;//不动时所在的房间
    private String inTime;//是否在该房间的生活规律模型中   不能用布尔值 否则前端接受不到
    private String times;//在该房间的生活规律模型中的  规律时间段
    private String flag;//针对 times 的类型  a表示活动 r休息
    private String position;//位置信息
    //wendu
    private Threshold_wendu threshold_wendu;
    private Integer wendu;//当前温度
    //light
    private Threshold_light threshold_light;
    private Integer light;//当前光强
    private Integer value;//当前持续时间 单位分钟
    //outdoor
    private String typeD;//用于存入出门历史信息的分类  out出门 come回来
    private Integer odid;
    private Integer oid; //方便出门历史信息查询
    private String oldName;//方便出门历史信息查询

    public Integer getWarnLevel() {
        return warnLevel;
    }

    public void setWarnLevel(Integer warnLevel) {
        this.warnLevel = warnLevel;
    }

    public OldMan getOldMan() {
        return oldMan;
    }

    public void setOldMan(OldMan oldMan) {
        this.oldMan = oldMan;
    }

    public Integer getNoMoveTime() {
        return noMoveTime;
    }

    public void setNoMoveTime(Integer noMoveTime) {
        this.noMoveTime = noMoveTime;
    }

    public String getTime() {
        return time;
    }

    public void setTime(String time) {
        this.time = time;
    }

    public Room getRoom() {
        return room;
    }

    public void setRoom(Room room) {
        this.room = room;
    }

    public String getInTime() {
        return inTime;
    }

    public void setInTime(String inTime) {
        this.inTime = inTime;
    }

    public String getTimes() {
        return times;
    }

    public void setTimes(String times) {
        this.times = times;
    }

    public String getFlag() {
        return flag;
    }

    public void setFlag(String flag) {
        this.flag = flag;
    }

    public String getPosition() {
        return position;
    }

    public void setPosition(String position) {
        this.position = position;
    }

    public Threshold_wendu getThreshold_wendu() {
        return threshold_wendu;
    }

    public void setThreshold_wendu(Threshold_wendu threshold_wendu) {
        this.threshold_wendu = threshold_wendu;
    }

    public Integer getWendu() {
        return wendu;
    }

    public void setWendu(Integer wendu) {
        this.wendu = wendu;
    }

    public Threshold_light getThreshold_light() {
        return threshold_light;
    }

    public void setThreshold_light(Threshold_light threshold_light) {
        this.threshold_light = threshold_light;
    }

    public Integer getLight() {
        return light;
    }

    public void setLight(Integer light) {
        this.light = light;
    }

    public Integer getValue() {
        return value;
    }

    public void setValue(Integer value) {
        this.value = value;
    }

    public String getTypeD() {
        return typeD;
    }

    public void setTypeD(String typeD) {
        this.typeD = typeD;
    }

    public Integer getOdid() {
        return odid;
    }

    public void setOdid(Integer odid) {
        this.odid = odid;
    }

    public Integer getOid() {
        return oid;
    }

    public void setOid(Integer oid) {
        this.oid = oid;
    }

    public String getOldName() {
        return oldName;
    }

    public void setOldName(String oldName) {
        this.oldName = oldName;
    }

    public String getOut() {
        return out;
    }

    public void setOut(String out) {
        this.out = out;
    }

    public String getDataD() {
        return dataD;
    }

    public void setDataD(String dataD) {
        this.dataD = dataD;
    }

    public String getReadD() {
        return readD;
    }

    public void setReadD(String readD) {
        this.readD = readD;
    }

    public String getTimeD() {
        return timeD;
    }

    public void setTimeD(String timeD) {
        this.timeD = timeD;
    }

    public Threshold_out getThreshold_out() {
        return threshold_out;
    }

    public void setThreshold_out(Threshold_out threshold_out) {
        this.threshold_out = threshold_out;
    }

    private String out;//出门的时间  不在outhistory数据库中
    private String dataD;//回来时  整个在户外的时间段  以及一些其他信息
    private String readD;//标记是否已读  是  否
    private String timeD;//添加时间
    private Threshold_out threshold_out;
    //





}
