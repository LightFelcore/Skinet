using System.Collections;
using Core.Entities;
using Core.Interfaces;

namespace Infrastructure.Data
{
    // Don't forget to implement the uom in the application services extensions 

    // NOTE
    // The unit of work pattern is used in order to avoid partial data updates in the database.
    // Before, each repository was injected. This could lead to problems because if in one of these a problem occure and in the others none, data would be partially added.
    // If there are multiple repositories used in one method of instance and one peace of logic fails, the uow wont add anything to the database for all of the repositories.
    // Either all the changes would be applied or none of the changes would be applied!!

    public class UnitOfWork : IUnitOfWork
    {
        private readonly StoreContext _context;
        private Hashtable _repositories;

        public UnitOfWork(StoreContext context)
        {
            _context = context;
        }

        public async Task<int> Complete()
        {
            // Save the changes to the database
            return await _context.SaveChangesAsync();
        }

        public void Dispose()
        {
            // Dispose
            _context.Dispose();
        }

        public IGenericRepository<TEntity> Repository<TEntity>() where TEntity : BaseEntity
        {
            // Check if we have a hashtable
            if (_repositories == null) _repositories = new Hashtable();

            // Get the name of the entity (Product, ProductBrand, ProductType, DeliveryMethod, ...)
            var type = typeof(TEntity).Name;

            // In case the repo is not part of the hashtable yet
            if (!_repositories.ContainsKey(type))
            {
                // Create a repository type of generic repository
                var repositoryType = typeof(GenericRepository<>);

                // create an instance of this repository and pass an instance that we get from the uow
                var repositoryInstance = Activator.CreateInstance(repositoryType.MakeGenericType(typeof(TEntity)), _context);

                // Add a specific repo to the hashtabble with the type as key and the repo instance as value
                _repositories.Add(type, repositoryInstance);
            }

            // return the specific reporitory from the hashtable
            return (IGenericRepository<TEntity>)_repositories[type];
        }
    }
}