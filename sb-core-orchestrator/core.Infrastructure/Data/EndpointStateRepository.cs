namespace core.Infrastructure.Data;

using core.Application.Interfaces;
using core.Domain.Entities;
using Microsoft.EntityFrameworkCore;

/// <summary>
/// Repository implementation for EndpointState entity persistence.
/// </summary>
public class EndpointStateRepository : IEndpointStateRepository
{
    private readonly CoreDbContext _context;

    public EndpointStateRepository(CoreDbContext context)
    {
        _context = context;
    }

    public async Task<EndpointState?> GetByIdAsync(string endpointId)
    {
        return await _context.EndpointsState.FindAsync(endpointId);
    }

    public async Task AddAsync(EndpointState endpointState)
    {
        await _context.EndpointsState.AddAsync(endpointState);
        await _context.SaveChangesAsync();
    }

    public async Task UpdateAsync(EndpointState endpointState)
    {
        _context.EndpointsState.Update(endpointState);
        await _context.SaveChangesAsync();
    }
}