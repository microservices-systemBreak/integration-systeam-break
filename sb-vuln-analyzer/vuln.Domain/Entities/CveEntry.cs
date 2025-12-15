namespace vuln.Domain.Entities;

/// <summary>
/// Represents a single CVE entry in the vulnerability database.
/// </summary>
public class CveEntry
{
    // EF Core requires a parameterless constructor
    private CveEntry()
    {
        CveId = string.Empty;
        PackageName = string.Empty;
        VulnerableVersionRange = string.Empty;
        Severity = string.Empty;
        Description = string.Empty;
    }

    /// <summary>
    /// Initializes a new instance of the <see cref="CveEntry"/> class.
    /// </summary>
    /// <param name="cveId">The CVE identifier (e.g., "CVE-2023-0286").</param>
    /// <param name="packageName">The name of the affected package.</param>
    /// <param name="vulnerableVersionRange">The range of versions affected by the vulnerability.</param>
    /// <param name="severity">The severity of the vulnerability (e.g., "High", "Critical").</param>
    /// <param name="cvssScore">The CVSS score of the vulnerability.</param>
    /// <param name="description">A description of the vulnerability.</param>
    public CveEntry(string cveId, string packageName, string vulnerableVersionRange, string severity, decimal cvssScore, string description)
    {
        CveId = cveId;
        PackageName = packageName;
        VulnerableVersionRange = vulnerableVersionRange;
        Severity = severity;
        CvssScore = cvssScore;
        Description = description;
    }

    /// <summary>
    /// The unique identifier for the CVE entry.
    /// </summary>
    public int Id { get; private set; }

    /// <summary>
    /// The CVE identifier (e.g., "CVE-2023-0286").
    /// </summary>
    public string CveId { get; private set; }

    /// <summary>
    /// The name of the affected package.
    /// </summary>
    public string PackageName { get; private set; }

    /// <summary>
    /// The range of versions affected by the vulnerability.
    /// This is a simplified representation. A real system might use a more complex model.
    /// </summary>
    public string VulnerableVersionRange { get; private set; }

    /// <summary>
    /// The severity of the vulnerability (e.g., "High", "Critical").
    /// </summary>
    public string Severity { get; private set; }

    /// <summary>
    /// The CVSS score of the vulnerability.
    /// </summary>
    public decimal CvssScore { get; private set; }

    /// <summary>
    /// A description of the vulnerability.
    /// </summary>
    public string Description { get; private set; }
}