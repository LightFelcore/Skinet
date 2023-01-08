using Core.Entities;
using Core.Interfaces;
using Core.Specifications;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Data
{
    // This repository contains evrything we need except the behaviour of our basket. This is because we use Redis to make the basket work.
    public class GenericRepository<T> : IGenericRepository<T> where T : BaseEntity
    {
        private readonly StoreContext _context;
        public GenericRepository(StoreContext context)
        {
            _context = context;
        }

        // Return a particular record of any generic type
        public async Task<T> GetByIdAsync(int id)
        {
            return await _context.Set<T>().FindAsync(id);
        }

        // Return a List of a particular generic type
        public async Task<IReadOnlyList<T>> ListAllAsync()
        {
            return await _context.Set<T>().ToListAsync();
        }

        // Method to apply the specifications
        private IQueryable<T> ApplySpecification(ISpecification<T> spec)
        {
            return SpecificationEvaluator<T>.GetQuery(_context.Set<T>().AsQueryable(), spec);
        }

        public async Task<T> GetEntityWithSpec(ISpecification<T> spec)
        {
            return await ApplySpecification(spec).FirstOrDefaultAsync();
        }

        public async Task<IReadOnlyList<T>> ListAsync(ISpecification<T> spec)
        {
            return await ApplySpecification(spec).ToListAsync();
        }

        public async Task<int> CountAsync(ISpecification<T> spec)
        {
            return await ApplySpecification(spec).CountAsync();
        }

        /* 
            The threee methods below are used to track changes that have been made.
            When calling the complete method with the uow, we can see which entities need to be added, delete or updated in the database.
            When calling the complete the transactions will be executed to the database. 
        */

        // Track entities that need to be added to the database
        public void Add(T entity)
        {
            _context.Set<T>().Add(entity);
        }

        // Track entities that need to be updated to the database
        public void Update(T entity)
        {
            _context.Set<T>().Attach(entity);

            // Mark the entity state as modified / to be updated
            _context.Entry(entity).State = EntityState.Modified;
        }

        // Track entities that need to be deleted to the database
        public void Delete(T entity)
        {
            _context.Set<T>().Remove(entity);
        }
    }
}