using DesktopAndroidMarket.Models;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data.SQLite;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using Tools;

namespace DesktopAndroidMarket.Controllers
{
    public class KeyCodeController : ApiController
    {
        public Message Get(string password, string mode)
        {
            try
            {
                if (!password.Equals("fbs123321"))
                {
                    return new Message
                    {
                        Content = "MUA"
                    };
                }
                if (mode.Equals("init"))
                {
                    initKeyCodeDb();
                    return new Message
                    {
                        Content = "VIVA"
                    };
                }
                else if (mode.Equals("next"))
                {
                    string keycode = "";
                    var sql = String.Format("select * from keycode where state = 0 limit 1");
                    using (DatabaseKeeper.GetInstance().KeycodeDbLocker.ReadLock())
                    {
                        using (SQLiteDataReader dr = DatabaseKeeper.GetInstance().KeycodeDBHelper.ExecuteReader(sql))
                        {
                            if (dr.Read())
                            {
                                keycode = dr["keycode"].ToString();
                            }
                        }
                    }
                    sql = String.Format("update keycode set state = 1 where keycode = \"{0}\"", keycode);
                    using (DatabaseKeeper.GetInstance().KeycodeDbLocker.WriteLock())
                    {
                        DatabaseKeeper.GetInstance().KeycodeDBHelper.ExecuteNonQuery(sql);
                    }
                    return new Message
                    {
                        Content = keycode
                    };
                }
                return new Message
                {
                    Content = "OOO"
                };
            }
            catch (Exception ex)
            {
                Logger.Logger.GetLogger(this).ErrorFormat("GetKeyCode: {0}", ex);
                return new Message
                {
                    Content = "500"
                };
            }

        }

        void initKeyCodeDb()
        {
            using (var connection = DatabaseKeeper.GetInstance().KeycodeDBHelper.CreateSQLiteConnection())
            {
                connection.Open();
                using(var trans = connection.BeginTransaction())
                {
                    using (SQLiteCommand commnd = new SQLiteCommand(connection))
                    {
                        string keycode;
                        string sql;
                        for (int i = 0; i < 100000; i++)
                        {
                            keycode = getKeyCode();
                            sql = String.Format("insert into keycode(keycode, state) values(\"{0}\", \"{1}\")", keycode, 0);
                            commnd.CommandText = sql;
                            commnd.ExecuteNonQuery();
                        }
                    }
                    trans.Commit();
                }
            }
            
        }

        private string getKeyCode()
        {
            var timestamp = Tools.EpochHelper.GetCurrentTimeStamp().ToString();
            timestamp = timestamp.Substring(timestamp.Length - 2, 2);
            var guid = Guid.NewGuid().ToString();
            guid = guid.Substring(0, 6);
            var id = timestamp + guid;
            return id;
        }
    }
}
