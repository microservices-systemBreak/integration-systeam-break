using vuln.Application.Interfaces;
using vuln.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace vuln.Infrastructure.Data
{
    // Repository for CVE entry data operations using Entity Framework Core.
    public class CveEntryRepository : ICveEntryRepository
    {
        private readonly VulnDbContext _dbContext;

        // Initializes a new instance of the CveEntryRepository class.
        public CveEntryRepository(VulnDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        // Gets CVE entries by package names.
        public async Task<List<CveEntry>> GetByPackageNamesAsync(List<string> packageNames)
        {
            return await _dbContext.CveEntries
                                   .Where(cve => packageNames.Contains(cve.PackageName))
                                   .ToListAsync();
        }

        // Adds a new CVE entry.
        public async Task AddAsync(CveEntry cveEntry)
        {
            await _dbContext.CveEntries.AddAsync(cveEntry);
        }

        // Saves changes to the database.
        public async Task<int> SaveChangesAsync()
        {
            return await _dbContext.SaveChangesAsync();
        }
    }
}