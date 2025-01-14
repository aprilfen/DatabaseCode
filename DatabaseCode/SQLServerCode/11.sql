USE [master]
GO
/****** Object:  Database [management]    Script Date: 2024/6/2 15:24:07 ******/
CREATE DATABASE [management]
 CONTAINMENT = NONE
 ON  PRIMARY 
( NAME = N'management', FILENAME = N'E:\April\SQL\SQL\management.mdf' , SIZE = 8192KB , MAXSIZE = UNLIMITED, FILEGROWTH = 65536KB )
 LOG ON 
( NAME = N'management_log', FILENAME = N'E:\April\SQL\SQL\management_log.ldf' , SIZE = 8192KB , MAXSIZE = 2048GB , FILEGROWTH = 65536KB )
 WITH CATALOG_COLLATION = DATABASE_DEFAULT, LEDGER = OFF
GO
ALTER DATABASE [management] SET COMPATIBILITY_LEVEL = 160
GO
IF (1 = FULLTEXTSERVICEPROPERTY('IsFullTextInstalled'))
begin
EXEC [management].[dbo].[sp_fulltext_database] @action = 'enable'
end
GO
ALTER DATABASE [management] SET ANSI_NULL_DEFAULT OFF 
GO
ALTER DATABASE [management] SET ANSI_NULLS OFF 
GO
ALTER DATABASE [management] SET ANSI_PADDING OFF 
GO
ALTER DATABASE [management] SET ANSI_WARNINGS OFF 
GO
ALTER DATABASE [management] SET ARITHABORT OFF 
GO
ALTER DATABASE [management] SET AUTO_CLOSE OFF 
GO
ALTER DATABASE [management] SET AUTO_SHRINK OFF 
GO
ALTER DATABASE [management] SET AUTO_UPDATE_STATISTICS ON 
GO
ALTER DATABASE [management] SET CURSOR_CLOSE_ON_COMMIT OFF 
GO
ALTER DATABASE [management] SET CURSOR_DEFAULT  GLOBAL 
GO
ALTER DATABASE [management] SET CONCAT_NULL_YIELDS_NULL OFF 
GO
ALTER DATABASE [management] SET NUMERIC_ROUNDABORT OFF 
GO
ALTER DATABASE [management] SET QUOTED_IDENTIFIER OFF 
GO
ALTER DATABASE [management] SET RECURSIVE_TRIGGERS OFF 
GO
ALTER DATABASE [management] SET  DISABLE_BROKER 
GO
ALTER DATABASE [management] SET AUTO_UPDATE_STATISTICS_ASYNC OFF 
GO
ALTER DATABASE [management] SET DATE_CORRELATION_OPTIMIZATION OFF 
GO
ALTER DATABASE [management] SET TRUSTWORTHY OFF 
GO
ALTER DATABASE [management] SET ALLOW_SNAPSHOT_ISOLATION OFF 
GO
ALTER DATABASE [management] SET PARAMETERIZATION SIMPLE 
GO
ALTER DATABASE [management] SET READ_COMMITTED_SNAPSHOT OFF 
GO
ALTER DATABASE [management] SET HONOR_BROKER_PRIORITY OFF 
GO
ALTER DATABASE [management] SET RECOVERY FULL 
GO
ALTER DATABASE [management] SET  MULTI_USER 
GO
ALTER DATABASE [management] SET PAGE_VERIFY CHECKSUM  
GO
ALTER DATABASE [management] SET DB_CHAINING OFF 
GO
ALTER DATABASE [management] SET FILESTREAM( NON_TRANSACTED_ACCESS = OFF ) 
GO
ALTER DATABASE [management] SET TARGET_RECOVERY_TIME = 60 SECONDS 
GO
ALTER DATABASE [management] SET DELAYED_DURABILITY = DISABLED 
GO
ALTER DATABASE [management] SET ACCELERATED_DATABASE_RECOVERY = OFF  
GO
EXEC sys.sp_db_vardecimal_storage_format N'management', N'ON'
GO
ALTER DATABASE [management] SET QUERY_STORE = ON
GO
ALTER DATABASE [management] SET QUERY_STORE (OPERATION_MODE = READ_WRITE, CLEANUP_POLICY = (STALE_QUERY_THRESHOLD_DAYS = 30), DATA_FLUSH_INTERVAL_SECONDS = 900, INTERVAL_LENGTH_MINUTES = 60, MAX_STORAGE_SIZE_MB = 1000, QUERY_CAPTURE_MODE = AUTO, SIZE_BASED_CLEANUP_MODE = AUTO, MAX_PLANS_PER_QUERY = 200, WAIT_STATS_CAPTURE_MODE = ON)
GO
USE [management]
GO
/****** Object:  Table [dbo].[Attendance]    Script Date: 2024/6/2 15:24:07 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Attendance](
	[AttendanceID] [int] NOT NULL,
	[EmployeeID] [int] NULL,
	[AttendanceDate] [date] NOT NULL,
	[Status] [int] NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[AttendanceID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Overtime]    Script Date: 2024/6/2 15:24:07 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Overtime](
	[OvertimeID] [int] NOT NULL,
	[EmployeeID] [int] NULL,
	[ODate] [date] NOT NULL,
	[OvertimeType] [nvarchar](50) NULL,
	[Otime] [decimal](18, 2) NOT NULL,
	[Oallowance] [decimal](18, 2) NULL,
PRIMARY KEY CLUSTERED 
(
	[OvertimeID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Job]    Script Date: 2024/6/2 15:24:07 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Job](
	[JobID] [int] NOT NULL,
	[JobTitle] [char](255) NOT NULL,
	[BaseSalary] [int] NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[JobID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Employee]    Script Date: 2024/6/2 15:24:07 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Employee](
	[EmployeeID] [int] NOT NULL,
	[EmployeeName] [char](16) NULL,
	[DepartmentID] [int] NOT NULL,
	[JobID] [int] NOT NULL,
	[WorkTypeID] [int] NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[EmployeeID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  View [dbo].[SalaryView]    Script Date: 2024/6/2 15:24:07 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- 创建工资视图
CREATE VIEW [dbo].[SalaryView] AS
SELECT 
    ROW_NUMBER() OVER (ORDER BY e.EmployeeID) AS SallID, -- 工资 ID
    e.EmployeeID, -- 员工 ID
    j.BaseSalary, -- 基本工资
    ISNULL(ot.TotalAllowance, 0) AS Allowance, -- 津贴
    ISNULL(att.TotalDeductions, 0) AS AttendanceDeduction, -- 考勤扣除
    (j.BaseSalary + ISNULL(ot.TotalAllowance, 0) - ISNULL(att.TotalDeductions, 0)) AS MonthlySalary, -- 月工资
    (j.BaseSalary + ISNULL(ot.TotalAllowance, 0) - ISNULL(att.TotalDeductions, 0)) * 12 AS AnnualSalaryTotal -- 年度工资总和
FROM 
    Employee e
JOIN 
    Job j ON e.JobID = j.JobID
LEFT JOIN 
    (
        SELECT 
            EmployeeID,
            SUM(Oallowance) AS TotalAllowance
        FROM 
            Overtime
        GROUP BY 
            EmployeeID
    ) ot ON e.EmployeeID = ot.EmployeeID
LEFT JOIN 
    (
        SELECT 
            EmployeeID,
            SUM(
                CASE 
                    WHEN Status = 1 THEN 100
                    WHEN Status = 2 THEN 100
                    WHEN Status = 3 THEN 300
                    ELSE 0
                END
            ) AS TotalDeductions
        FROM 
            Attendance
        GROUP BY 
            EmployeeID
    ) att ON e.EmployeeID = att.EmployeeID;
GO
/****** Object:  View [dbo].[AnnualBonusView]    Script Date: 2024/6/2 15:24:07 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- 创建年终奖金视图
CREATE VIEW [dbo].[AnnualBonusView] AS
SELECT 
    e.EmployeeID, -- 员工 ID
    (SUM(j.BaseSalary) + ISNULL(SUM(ot.TotalAllowance), 0)) / 12 AS AnnualBonus -- 年终奖金
FROM 
    Employee e
JOIN 
    Job j ON e.JobID = j.JobID
LEFT JOIN 
    (
        SELECT 
            EmployeeID,
            SUM(Oallowance) AS TotalAllowance
        FROM 
            Overtime
        GROUP BY 
            EmployeeID
    ) ot ON e.EmployeeID = ot.EmployeeID
GROUP BY 
    e.EmployeeID;
GO
/****** Object:  Table [dbo].[Department]    Script Date: 2024/6/2 15:24:07 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Department](
	[DepartmentID] [int] NOT NULL,
	[DepartmentName] [char](255) NOT NULL,
	[Dprincipal] [char](16) NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[DepartmentID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[WorkType]    Script Date: 2024/6/2 15:24:07 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[WorkType](
	[WorkTypeID] [int] NOT NULL,
	[WorkTypeName] [char](255) NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[WorkTypeID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
ALTER TABLE [dbo].[Attendance] ADD  DEFAULT ((0)) FOR [Status]
GO
ALTER TABLE [dbo].[Overtime] ADD  DEFAULT ('法定加班') FOR [OvertimeType]
GO
ALTER TABLE [dbo].[Overtime] ADD  DEFAULT ((0.00)) FOR [Otime]
GO
ALTER TABLE [dbo].[Attendance]  WITH CHECK ADD  CONSTRAINT [Attendance_EmployeeID] FOREIGN KEY([EmployeeID])
REFERENCES [dbo].[Employee] ([EmployeeID])
GO
ALTER TABLE [dbo].[Attendance] CHECK CONSTRAINT [Attendance_EmployeeID]
GO
ALTER TABLE [dbo].[Employee]  WITH CHECK ADD  CONSTRAINT [Employee_DepartmentID] FOREIGN KEY([DepartmentID])
REFERENCES [dbo].[Department] ([DepartmentID])
GO
ALTER TABLE [dbo].[Employee] CHECK CONSTRAINT [Employee_DepartmentID]
GO
ALTER TABLE [dbo].[Employee]  WITH CHECK ADD  CONSTRAINT [Employee_JobID] FOREIGN KEY([JobID])
REFERENCES [dbo].[Job] ([JobID])
GO
ALTER TABLE [dbo].[Employee] CHECK CONSTRAINT [Employee_JobID]
GO
ALTER TABLE [dbo].[Employee]  WITH CHECK ADD  CONSTRAINT [Employee_WorkTypeID] FOREIGN KEY([WorkTypeID])
REFERENCES [dbo].[WorkType] ([WorkTypeID])
GO
ALTER TABLE [dbo].[Employee] CHECK CONSTRAINT [Employee_WorkTypeID]
GO
ALTER TABLE [dbo].[Overtime]  WITH CHECK ADD  CONSTRAINT [Overtime_EmployeeID] FOREIGN KEY([EmployeeID])
REFERENCES [dbo].[Employee] ([EmployeeID])
GO
ALTER TABLE [dbo].[Overtime] CHECK CONSTRAINT [Overtime_EmployeeID]
GO
ALTER TABLE [dbo].[Attendance]  WITH CHECK ADD  CONSTRAINT [CHK_Status] CHECK  (([Status]=(3) OR [Status]=(2) OR [Status]=(1) OR [Status]=(0)))
GO
ALTER TABLE [dbo].[Attendance] CHECK CONSTRAINT [CHK_Status]
GO
ALTER TABLE [dbo].[Job]  WITH CHECK ADD CHECK  (([BaseSalary]>(0)))
GO
ALTER TABLE [dbo].[Overtime]  WITH CHECK ADD  CONSTRAINT [CHK_OvertimeType] CHECK  (([OvertimeType]='协商加班' OR [OvertimeType]='法定加班'))
GO
ALTER TABLE [dbo].[Overtime] CHECK CONSTRAINT [CHK_OvertimeType]
GO
USE [master]
GO
ALTER DATABASE [management] SET  READ_WRITE 
GO
