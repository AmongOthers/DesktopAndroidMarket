using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Threading;
using System.Web;
using Tools;

namespace DesktopAndroidMarket
{
    public class DatabaseKeeper
    {
        static DatabaseKeeper instance;
        static object instanceLock = new object();
        SQLiteDBHelper appHelper;
        SQLiteDBHelper registerHelper;
        SQLiteDBHelper keycodeHelper;
        object appHelperLock = new object();
        object registerHelperLock = new object();
        object keycodeHelperLock = new object();
        ReaderWriterObjectLocker appDbLocker = new ReaderWriterObjectLocker();
        ReaderWriterObjectLocker registerDbLocker = new ReaderWriterObjectLocker();
        ReaderWriterObjectLocker keycodeDbLocker = new ReaderWriterObjectLocker();
        public ReaderWriterObjectLocker AppDbLocker
        {
            get
            {
                return appDbLocker;
            }
        }
        public ReaderWriterObjectLocker RegisterDbLocker
        {
            get
            {
                return registerDbLocker;
            }
        }
        public ReaderWriterObjectLocker KeycodeDbLocker
        {
            get
            {
                return keycodeDbLocker;
            }
        }


        public static DatabaseKeeper GetInstance()
        {
            lock (instanceLock)
            {
                if (instance == null)
                {
                    instance = new DatabaseKeeper();
                }
                return instance;
            }
        }

        public SQLiteDBHelper RegisterDBHelper
        {
            get
            {
                lock (this.registerHelperLock)
                {
                    if (this.registerHelper == null)
                    {
                        var appRoot = ConfigurationManager.AppSettings["AppRoot"];
                        this.registerHelper = new SQLiteDBHelper(String.Format("{0}/register/register", appRoot));
                    }
                }
                return this.registerHelper;
            }
        }

        public SQLiteDBHelper AppDBHelper
        {
            get
            {
                lock (this.appHelperLock)
                {
                    if (this.appHelper == null)
                    {
                        var appRoot = ConfigurationManager.AppSettings["AppRoot"];
                        this.appHelper = new SQLiteDBHelper(String.Format("{0}/app/app", appRoot));
                    }
                }
                return this.appHelper;
            }
        }

        public SQLiteDBHelper KeycodeDBHelper
        {
            get
            {
                lock (this.keycodeHelperLock)
                {
                    if (this.keycodeHelper == null)
                    {
                        var appRoot = ConfigurationManager.AppSettings["AppRoot"];
                        this.keycodeHelper = new SQLiteDBHelper(String.Format("{0}/keycode/keycode", appRoot));
                    }
                }
                return this.keycodeHelper;
            }
        }

    }
}