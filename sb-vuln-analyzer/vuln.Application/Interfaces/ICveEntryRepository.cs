using vuln.Domain.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace vuln.Application.Interfaces
{
    // Interface for CVE entry data operations.
    public interface ICveEntryRepository
    {
        // Gets CVE entries by package names.
        Task<List<CveEntry>> GetByPackageNamesAsync(List<string> packageNames);
        
        // Adds a new CVE entry.
        Task AddAsync(CveEntry cveEntry);

        // Saves changes to the database.
        Task<int> SaveChangesAsync();
    }
}