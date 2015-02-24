using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace DesktopAndroidMarket.Models
{
    public class AppResult
    {
        public List<AppResultItem> list { get; set; }
        public int pageSize { get; set; }
        public int dataSize { get; set; }
        public int offSet { get; set; }
        public int pageNum { get; set; }
        public int position { get; set; }
    }
}