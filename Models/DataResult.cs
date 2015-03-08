using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace DesktopAndroidMarket.Models
{
    public class DataResult
    {
        public int AdvancedUsersCount;
        public List<string> AdvancedUsers;
        public int TrialUsersCount;
        public List<DataResultItem> TiralUsers;
    }
}