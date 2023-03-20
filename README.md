## Tổng kết
Những thứ em làm được ở project này (chủ yếu là về backend (Dùng swagger để test) -> chưa làm frontend): 
- Người dùng chưa đăng nhập thì không thể comment vào bất kỳ bài viết nào (kiểm tra jwt tồn tại + hợp lệ)
- xác thực người dùng để có thể đăng, xóa, sửa bài viết của chính họ cũng như comment chính họ (jwt + check phải chủ post hay không)
- tìm kiếm post dựa trên key miễn là title hoặc body chứa key là sẽ đưa ra kết quả (dùng like)
- người dùng có thể đăng ảnh kèm theo post (multer + cloudinary)
- viết chủ yếu bằng typescript có strictmode

## Mô tả
```bash
$ Project sử dụng framework NestJS  chạy trên môi trường NodeJS.
$ Chủ yếu làm bằng typecript
$ Database dùng postgres được deploy lên onrender
$ Server được deploy lên onrender
```
## Kỹ thuật
```bash
$ JWT -> tạo accessToken, refreshToken -> phục phụ cho authorization, authentication
$ Cloudinary + multer -> upload file + lưu trữ
$ typeorm + pg -> kết nối + tương tác db
$ bcrypt -> mã hóa password
$ swagger -> tạo doc api
$ graphql + appolo server 
```
## Lệnh run project
```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

```bash
# unit tests (chưa hoàn thành)
$ npm run test

# e2e tests (chưa hoàn thành)
$ npm run test:e2e

# test coverage (chưa hoàn thành)
$ npm run test:cov
```

## Product

# Tài khoản đăng nhập
- username: haotruong123
- password: 12345678
```bash
# link server
$ [LINK](https://bizzi-challenge-tvh.onrender.com)

# link doc api
$ [LINK](https://bizzi-challenge-tvh.onrender.com/api)
```
