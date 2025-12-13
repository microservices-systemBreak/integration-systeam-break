FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS base
WORKDIR /app
EXPOSE 8080

FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src

# Copy csproj files
# Copy csproj files
COPY ["sb-vuln-analyzer/vuln.Api/vuln.Api.csproj", "sb-vuln-analyzer/vuln.Api/"]
COPY ["sb-vuln-analyzer/vuln.Application/vuln.Application.csproj", "sb-vuln-analyzer/vuln.Application/"]
COPY ["sb-vuln-analyzer/vuln.Domain/vuln.Domain.csproj", "sb-vuln-analyzer/vuln.Domain/"]
COPY ["sb-vuln-analyzer/vuln.Infrastructure/vuln.Infrastructure.csproj", "sb-vuln-analyzer/vuln.Infrastructure/"]
COPY ["sb.Shared/sb.Shared.csproj", "sb.Shared/"]

RUN dotnet restore "sb-vuln-analyzer/vuln.Api/vuln.Api.csproj"

# Copy everything else
COPY . .

WORKDIR "/src/sb-vuln-analyzer/vuln.Api"
RUN dotnet build "vuln.Api.csproj" -c $BUILD_CONFIGURATION -o /app/build

FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish "vuln.Api.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "vuln.Api.dll"]