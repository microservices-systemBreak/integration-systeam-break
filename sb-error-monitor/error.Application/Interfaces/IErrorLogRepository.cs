using error.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace error.Application.Interfaces
{
    // Interface for error log data operations.
    public interface IErrorLogRepository
    {
        // Adds a new error log.
        Task AddAsync(ErrorLog errorLog);

        // Gets error logs by service with pagination.
        Task<List<ErrorLog>> GetByServiceAsync(string service, int page, int pageSize);

        // Gets an error log by its ID.
        Task<ErrorLog?> GetByIdAsync(Guid id);

        // Updates an existing error log.
        void Update(ErrorLog errorLog);

        // Saves changes to the database.
        Task<int> SaveChangesAsync();
    }
}