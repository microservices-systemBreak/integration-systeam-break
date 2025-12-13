using core.Domain.Entities;
using System.Threading.Tasks;

namespace core.Application.Interfaces
{
    public interface IJobRepository
    {
        Task<Job?> GetByIdAsync(string jobId);
        Task AddAsync(Job job);
        Task UpdateAsync(Job job);
    }
}