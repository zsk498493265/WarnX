package com.warn.dao;

import com.warn.entity.*;
import com.warn.dto.PageHelper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * Created by admin on 2017/4/4.
 */
public interface DataDao {

    Long getDatagridTotal(@Param("oldMan")OldMan oldMan);

    Long getDatagridTotal_worker(@Param("worker")Worker worker);

    Long getDatagridTotalNG(@Param("oldMan")OldMan oldMan);

    List<OldMan> datagridUser(@Param("page")PageHelper page,@Param("oldMan")OldMan oldMan);//两个参数的话 要加Param

    List<Worker> datagridUser_worker(@Param("page")PageHelper page,@Param("worker")Worker worker);//两个参数的话 要加Param

    List<OldMan> datagridNGUser(@Param("page")PageHelper page,@Param("oldMan")OldMan oldMan);

    Integer addOldman(OldMan oldMan);

    void editOldman(OldMan oldMan);

    void deleteOldmanById(@Param("id")Integer oldManId);

    void deleteWorkerById(@Param("id")Integer id);

    void addRelatives(Relatives relatives);

    void editRelatives(Relatives relatives);

    void deleteRelativesByOldManId(@Param("id")Integer oldManId);

    OldMan getOldManByEquipId(@Param("id")String sensorPointObjID);

    List<OldMan> datagridMap(LouMarker louMarker);

    OldMan getOldManByOid(@Param("id")Integer oid);

    List<OldMan> getAllOldMan();

    List<OldMan> getOldManNG();

    Integer getCount();

    OldMan getOldManByGatewayID(Integer gatewayID);

    List<OldMan> getOldManBySegment(String segment);

    void editOldManStatus(OldMan oldMan);

    List<OldMan> datagridUserMap(@Param("page")PageHelper page,@Param("oldMan") OldMan oldMan);

    void editOldmanMap(OldMan oldMan);

    Integer addWorker(Worker worker);

    Integer addXungeng(Xungeng xungeng);
}
