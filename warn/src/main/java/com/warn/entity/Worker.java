package com.warn.entity;

/**
 * Created by admin on 2017/4/5.
 */
//老人基本信息
public class Worker {

    private Integer id;
    private String password;//网关ID   存入数据库是十进制  显示是十进制+二进制  转换在前端完成

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getQq() {
        return qq;
    }

    public void setQq(String qq) {
        this.qq = qq;
    }

    public String getOldRegtime() {
        return oldRegtime;
    }

    public void setOldRegtime(String oldRegtime) {
        this.oldRegtime = oldRegtime;
    }

    private String name;//网段标志
    private String phone; //姓名
    private String qq;//电话
    private String oldRegtime;//注册时间



    public Worker() {
    }

    public Worker(Integer id) {
        this.id = id;
    }



    //重写equals hashcode 不然获得不了以oldman为键的map的值
    @Override
    public boolean equals(Object obj) {
        Worker oldMan= (Worker) obj;
        return oldMan.getId().intValue()==id.intValue();
    }

    @Override
    public int hashCode() {
        int result = 17;
        result = result * 31 + id.hashCode();
        return result;
    }


}
