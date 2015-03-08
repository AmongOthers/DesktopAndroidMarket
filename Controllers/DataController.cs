using DesktopAndroidMarket.Models;
using System;
using System.Collections.Generic;
using System.Data.SQLite;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace DesktopAndroidMarket.Controllers
{
    public class DataController : ApiController
    {
        public DataResult Get()
        {
            var dataResult = new DataResult();
            dataResult.AdvancedUsers = new List<string>();
            dataResult.TiralUsers = new List<DataResultItem>();
            string machineId;
            int occupyTimes;
            using(DatabaseKeeper.GetInstance().RegisterDbLocker.ReadLock())
            {
                var sql = String.Format("select * from register where keycode != \"\"");
                using (SQLiteDataReader dr = DatabaseKeeper.GetInstance().RegisterDBHelper.ExecuteReader(sql))
                {
                    while (dr.Read())
                    {
                        machineId = dr["machineid"].ToString();
                        dataResult.AdvancedUsers.Add(machineId);
                    }
                }
                sql = String.Format("select * from register where keycode = \"\"");
                using (SQLiteDataReader dr = DatabaseKeeper.GetInstance().RegisterDBHelper.ExecuteReader(sql))
                {
                    while (dr.Read())
                    {
                        machineId = dr["machineid"].ToString();
                        occupyTimes = Int16.Parse(dr["occupytimes"].ToString());
                        dataResult.TiralUsers.Add(new DataResultItem { MachineId = machineId, OccupyTimes = occupyTimes });
                    }
                }
            }
            dataResult.AdvancedUsersCount = dataResult.AdvancedUsers.Count;
            dataResult.TrialUsersCount = dataResult.TiralUsers.Count;
            return dataResult;
        }
    }
}
