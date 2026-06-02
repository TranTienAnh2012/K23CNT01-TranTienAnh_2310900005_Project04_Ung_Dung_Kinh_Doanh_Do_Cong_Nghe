-- Script tạo bảng G5_banner liên kết với danh mục sản phẩm trên SQL Server
CREATE TABLE G5_banner (
    G5_BannerID INT IDENTITY(1,1) PRIMARY KEY,
    G5_MaDanhMuc INT NULL,
    G5_TieuDe NVARCHAR(255) NULL,
    G5_MoTa NVARCHAR(MAX) NULL,
    G5_UrlAnh NVARCHAR(MAX) NULL,
    G5_LinkRedirect VARCHAR(500) NULL,
    G5_TrangThai INT DEFAULT 1,
    G5_NgayTao DATETIME DEFAULT GETDATE(),
    CONSTRAINT FK_G5_banner_danhmuc FOREIGN KEY (G5_MaDanhMuc) REFERENCES G5_danhmuc(G5_MaDanhMuc)
);
GO
