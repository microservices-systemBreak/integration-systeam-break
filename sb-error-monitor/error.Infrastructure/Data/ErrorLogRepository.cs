using error.Application.Interfaces;
using error.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace error.Infrastructure.Data
{
    // Repository implementation for ErrorLog using Entity Framework Core.
    public class ErrorLogRepository : IErrorLogRepository
    {
        private readonly ErrorDbContext _dbContext;

        // Initializes a new instance of the ErrorLogRepository class.
        public ErrorLogRepository(ErrorDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        // Adds a new error log.
        public async Task AddAsync(ErrorLog errorLog)
        {
            await _dbContext.ErrorLogs.AddAsync(errorLog);
        }

        // Gets error logs by service with pagination.
        public async Task<List<ErrorLog>> GetByServiceAsync(string service, int page, int pageSize)
        {
            var query = _dbContext.ErrorLogs.AsQueryable();

            if (!string.IsNullOrEmpty(service))
            {
                query = query.Where(e => e.Service == service);
            }

            return await query.OrderByDescending(e => e.Timestamp)
                              .Skip((page - 1) * pageSize)
                              .Take(pageSize)
                              .ToListAsync();
        }

        // Gets an error log by its ID.
        public async Task<ErrorLog?> GetByIdAsync(Guid id)
        {
            return await _dbContext.ErrorLogs.FindAsync(id);
        }

        // Updates an existing error log.
        public void Update(ErrorLog errorLog)
        {
            _dbContext.ErrorLogs.Update(errorLog);
        }

        // Saves changes to the database.
        public async Task<int> SaveChangesAsync()
        {
            return await _dbContext.SaveChangesAsync();
        }
    }
}