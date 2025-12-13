namespace core.Infrastructure.Data;

using core.Application.Interfaces;
using core.Domain.Entities;
using Microsoft.EntityFrameworkCore;

/// <summary>
/// Repository implementation for Job entity persistence.
/// </summary>
public class JobRepository : IJobRepository
{
    private readonly CoreDbContext _context;

    public JobRepository(CoreDbContext context)
    {
        _context = context;
    }

    public async Task<Job?> GetByIdAsync(string jobId)
    {
        return await _context.Jobs.FindAsync(jobId);
    }

    public async Task AddAsync(Job job)
    {
        await _context.Jobs.AddAsync(job);
        await _context.SaveChangesAsync();
    }

    public async Task UpdateAsync(Job job)
    {
        _context.Jobs.Update(job);
        await _context.SaveChangesAsync();
    }
}
