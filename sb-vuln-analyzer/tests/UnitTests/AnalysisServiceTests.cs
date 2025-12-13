using Moq;
using Xunit;
using vuln.Application.Services;
using vuln.Application.Interfaces;
using vuln.Application.DTOs;
using vuln.Domain.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;
using System;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Logging.Abstractions;

namespace vuln.UnitTests.Services
{
    public class AnalysisServiceTests
    {
        private readonly Mock<ICveEntryRepository> _cveRepositoryMock;
        private readonly AnalysisService _service;

        public AnalysisServiceTests()
        {
            _cveRepositoryMock = new Mock<ICveEntryRepository>();
            _service = new AnalysisService(_cveRepositoryMock.Object, new Microsoft.Extensions.Logging.Abstractions.NullLogger<AnalysisService>());
        }

        [Fact]
        public async Task AnalyzePackages_ShouldDetectHighSeverity_WhenCriticalCveExists()
        {
            // Arrange
            var agentId = "agent-01";
            var request = new AnalysisRequest
            {
                AgentId = agentId,
                Packages = new List<PackageInfoDto>
                {
                    new PackageInfoDto { Name = "openssl", Version = "1.0.0" }
                }
            };

            var cveList = new List<CveEntry>
            {
                new CveEntry(
                    "CVE-2023-9999", 
                    "openssl", 
                    "1.0.0", 
                    "CRITICAL", 
                    9.8m, 
                    "Critical bug"
                )
            };

            _cveRepositoryMock.Setup(repo => repo.GetByPackageNamesAsync(It.IsAny<List<string>>()))
                .ReturnsAsync(cveList);

            // Act
            var result = await _service.AnalyzePackagesAsync(request, "test-corr-id");

            // Assert
            // Assert.Equal(agentId, result.AgentId); // Removed: AgentId not present in VulnerabilityAnalysis DTO
            
            // I will Assert.Equal("CRITICAL", result.OverallSeverity);
            Assert.Equal("CRITICAL", result.OverallSeverity);
            Assert.NotEmpty(result.Vulnerabilities);
            Assert.Equal("CVE-2023-9999", result.Vulnerabilities[0].CveId);
        }

        [Fact]
        public async Task AnalyzePackages_ShouldReturnSafe_WhenNoVulnerabilitiesFound()
        {
            // Arrange
            var request = new AnalysisRequest
            {
                AgentId = "agent-02",
                Packages = new List<PackageInfoDto>
                {
                    new PackageInfoDto { Name = "safe-lib", Version = "2.0.0" }
                }
            };

            _cveRepositoryMock.Setup(repo => repo.GetByPackageNamesAsync(It.IsAny<List<string>>()))
                .ReturnsAsync(new List<CveEntry>());

            // Act
            var result = await _service.AnalyzePackagesAsync(request, "test-corr-id-2");

            // Assert
            Assert.Equal("NONE", result.OverallSeverity);
            Assert.Empty(result.Vulnerabilities);
        }
    }
}
