FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS base
WORKDIR /app
EXPOSE 8080

FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src

# Copy csproj files
COPY ["vuln.Api/vuln.Api.csproj", "vuln.Api/"]
COPY ["vuln.Application/vuln.Application.csproj", "vuln.Application/"]
COPY ["vuln.Domain/vuln.Domain.csproj", "vuln.Domain/"]
COPY ["vuln.Infrastructure/vuln.Infrastructure.csproj", "vuln.Infrastructure/"]

RUN dotnet restore "vuln.Api/vuln.Api.csproj"

# Copy everything else
COPY . .

WORKDIR "/src/vuln.Api"
RUN dotnet build "vuln.Api.csproj" -c $BUILD_CONFIGURATION -o /app/build

FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish "vuln.Api.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "vuln.Api.dll"]