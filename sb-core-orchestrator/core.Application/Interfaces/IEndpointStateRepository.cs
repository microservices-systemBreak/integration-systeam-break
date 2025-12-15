using core.Domain.Entities;
using System.Threading.Tasks;

namespace core.Application.Interfaces
{
    public interface IEndpointStateRepository
    {
        Task<EndpointState?> GetByIdAsync(string endpointId);
        Task AddAsync(EndpointState endpointState);
        Task UpdateAsync(EndpointState endpointState);
    }
}