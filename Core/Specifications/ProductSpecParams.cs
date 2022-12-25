using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Core.Specifications
{
    public class ProductSpecParams
    {
        private const int MaxPageSize = 50;
        public int PageIndex { get; set; } = 1; // y default return the very first page
        private int _pageSize = 6;
        public int PageSize
        {
            get => _pageSize;
            // If the page size is greater then 50 return 50 otherwise take the value as PageSize
            set => _pageSize = (value > MaxPageSize) ? MaxPageSize : value;
        }
        public int? BrandId { get; set; }
        public int? TypeId { get; set; }
        public string Sort { get; set; }
        private string _search;
        public string Search 
        { 
            get => _search;
            set => _search = value.ToLower();
        }
    }
}