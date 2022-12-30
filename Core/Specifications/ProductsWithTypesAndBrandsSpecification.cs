using System.Linq.Expressions;
using Core.Entities;

namespace Core.Specifications
{
    public class ProductsWithTypesAndBrandsSpecification : BaseSpecification<Product>
    {
        public ProductsWithTypesAndBrandsSpecification(ProductSpecParams productParams)
            // If there is a search term, check if any product name matches with given search term
            // If brandId or typeId have a value, enable the filtering by passing the expression the the BaseSpecification parent class
            : base(x => 
                (string.IsNullOrEmpty(productParams.Search) || x.Name.ToLower().Contains(productParams.Search)) &&
                (!productParams.BrandId.HasValue || x.ProductBrandId == productParams.BrandId) &&
                (!productParams.TypeId.HasValue || x.ProductTypeId == productParams.TypeId)
            )
        {
            AddInclude(x => x.ProductType);
            AddInclude(x => x.ProductBrand);
            AddOrderBy(x => x.Name); // By default, if no filtering is added to the api request, the products will be sorted by name
            ApplyPaging(productParams.PageSize * (productParams.PageIndex - 1), productParams.PageSize);

            // Sqlite case: before sorting by price, which is stored as decimals, it needs to be converted to doubles in the StoreContext.cs (Sqlite has no support for doubles)
            if(!string.IsNullOrEmpty(productParams.Sort)) {
                switch (productParams.Sort)
                {
                    case "priceAsync":
                        AddOrderBy(p => p.Price);
                        break;
                    case "priceDesc":
                        AddOrderByDescending(p => p.Price);
                        break;
                    default:
                        AddOrderBy(p => p.Name);
                        break;
                }
            }
        }

        public ProductsWithTypesAndBrandsSpecification(int id) : base(x => x.Id == id)
        {
            AddInclude(x => x.ProductType);
            AddInclude(x => x.ProductBrand);
        }
    }
}