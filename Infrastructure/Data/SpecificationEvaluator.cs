using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Core.Entities;
using Core.Specifications;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Data
{
    public class SpecificationEvaluator<TEntity> where TEntity : BaseEntity
    {
        public static IQueryable<TEntity> GetQuery(IQueryable<TEntity> inputQuery, ISpecification<TEntity> spec) {
            var query = inputQuery;

            // Critaria: f.e --> x.Id == id
            if(spec.Criteria != null) {
                query = query.Where(spec.Criteria);
            }

            if(spec.OrderBy != null) {
                query = query.OrderBy(spec.OrderBy);
            }

            if(spec.OrderByDescending != null) {
                query = query.OrderByDescending(spec.OrderByDescending);
            }

            // Paging needs always to come after filtering (Where) and sorting (OrderBy/OrderByDescending) behaviors 
            // Skip() = Bypasses a specified number of elements in a sequence and then returns the remaining elements.
            // Take() = The number of elements to return.
            if(spec.IsPagingEnabled) {
                query = query.Skip(spec.Skip).Take(spec.Take);
            }

            // current = The entity type we pass into
            // This line will aggregate/chain multiple include statements with given entity. We get back an IQueryable
            query = spec.Includes.Aggregate(query, (current, include) => current.Include(include));

            return query;
        }
    }
}