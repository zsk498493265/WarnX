package com.warn.entity;

import java.util.Date;

public class WorkerMarker {
    private Integer id;
    private String cx;//坐标
    private String cy;//坐标
    private Date time;//更新时间
    private Integer taskid;
    private String name;
    private String qq;
    private String phone;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getcx() {
        return cx;
    }

    public void setcx(String cx) {
        this.cx = cx;
    }

    public String getcy() {
        return cy;
    }

    public void setcy(String cy) {
        this.cy = cy;
    }

    public Date getTime() {
        return time;
    }

    public void setTime(Date time) {
        this.time = time;
    }
    
    public Integer getTaskid() {
        return taskid;
    }

    public void setTaskid(Integer taskid) {
        this.taskid = taskid;
    }
    
    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getQq() {
        return qq;
    }

    public void setQq(String qq) {
        this.qq = qq;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }
}
