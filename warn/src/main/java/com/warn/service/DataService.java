package com.warn.service;

import com.warn.entity.OldMan;
import com.warn.dto.PageHelper;
import com.warn.entity.Worker;
import com.warn.entity.Xungeng;

import java.util.List;

/**
 * Created by admin on 2017/4/5.
 */
public interface DataService {
    //获取老人信息总数（或查询到的总数）
    Long getDatagridTotal(OldMan oldMan);

    Long getDatagridTotal_worker(Worker worker);

    Long getDatagridTotalNG(OldMan oldMan);
    //获得老人列表
    List<OldMan> datagridUser(PageHelper page,OldMan oldMan);

    List<Worker> datagridUser_worker(PageHelper page,Worker worker);

    List<OldMan> datagridNGUser(PageHelper page,OldMan oldman);
    //添加老人
    void addOldman(OldMan oldMan, Integer segmentTwo_Ten);
    //修改老人
    void editOldman(OldMan oldMan,Integer segmentTwo_Ten);
    //删除老人
    void deleteOldmanById(Integer oldManId);

    void updateOldmanStatusById(Integer oldManId);

    void updateOldmanStatusById2(Integer oldManId);

    void deleteWorkerById(Integer id);

    List<OldMan> getAllOldmanID_Name();

    List<OldMan> getOldmanId_NG();

    List<OldMan> datagridUserMap(PageHelper page, OldMan oldMan);

    void editOldmanMap(OldMan oldMan);

    //添加工人
    void addWorker(Worker worker);
    //添加巡更
    void addXungeng(Xungeng xungeng);

}
