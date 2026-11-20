# DREAM STORE على Vercel

الموقع كامل (واجهة + API + لوحة الأدمن) جاهز للنشر على Vercel. المشكلة الوحيدة اللي كانت كاينة هي الحفظ: على Vercel ما كاينش قرص دائم. حلّيناها بـ **Vercel Blob**: كامل حالة المتجر (منتجات، طلبات، تقييمات، إعدادات، وكلمة مرور الأدمن) كتحفظ فملف JSON واحد داخل Blob خاص، ورفع الصور كيبقى مضمّن فنفس الملف.

> البيانات الابتدائية فـ `data/store.seed.json` (المنتجات + كلمة المرور `admin1234`) كيتنقلو تلقائياً إلى Blob عند أول طلب بعد النشر. ملف `data/store.json` المحلي كيبقى مخفي فـ Git.

## 1) إنشاء Blob Storage

1. ارفع المشروع لـ GitHub أو GitLab.
2. في Vercel: **Add New… → Project** واستورد المستودع. Vercel كيتعرّف على Next.js ومع `pnpm` تلقائياً.
3. من sidebar ديال المشروع: **Storage → Create Store → Blob**.
4. اختار **Private**، سمّيو `dream-store`، وفعّل **Add a read-write token env var to this connection**.
5. **Create**، وتأكد أن المشروع مرتبط بـ **Production** (و **Development** إلا بغيتي تشغّلو محلياً).

## 2) Environment Variables

من **Project Settings → Environment Variables** ضيف:

```text
SESSION_SECRET = قيمة عشوائية طويلة
ADMIN_USER = admin
ADMIN_PASSWORD = admin1234
```

ولّا يمكن تستبدل `ADMIN_PASSWORD` بـ `ADMIN_PASSWORD_HASH` (ولّدو بـ `pnpm admin:hash`).

متغيرات Blob (`BLOB_READ_WRITE_TOKEN` / `BLOB_STORE_ID` / `VERCEL_OIDC_TOKEN`) كيتضافوا تلقائياً من خطوة Storage — ما ديرش غير كتبهم بيدك.

بعد ما تضيفهم، أعد النشر (**Deployments → ⋮ → Redeploy**).

## 3) الرابط الدائم والدومين

Vercel كيعطيك رابط دائم من نوع `https://<project>.vercel.app`. باش تستعمل دومينك:

1. **Project Settings → Domains** → أضف دومينك.
2. عند شركة الدومين (DNS) حط:
   ```text
   Type: A      Name: @     Value: 76.76.21.21
   Type: CNAME  Name: www   Value: cname.vercel-dns.com
   ```
   Vercel كيعطيك القيم الدقيقة فالصفحة ديال Domains — دير بتلك القيم.
3. انتظر قليلاً حتى يظهر **Valid Configuration**. HTTPS كيتفعّل تلقائياً.

## 4) التحقق

بعد النشر جرّب:

```text
https://دومينك/api/health
```

النتيجة المتوقعة:

```json
{ "ok": true, "store": "DREAM STORE", "storage": "vercel-blob" }
```

وجرّب:

- `https://دومينك/` → الواجهة والمنتجات كيجيو من `/api/products`.
- `https://دومينك/admin` → الدخول بـ `admin` / `admin1234`.
- زر **⋮ مزيد من الخيارات** في الشريط العلوي كيبقى مخفي من القائمة الرئيسية.

## ملاحظات

- كل تعديل من لوحة الأدمن كيكتب فBlob، يعني كيبقى بعد إعادة النشر وبعد أي restart.
- الصور اللي كتترفع من الأدمن أو من تقييمات الزبائن كتضغط فالمتصفح وكتحفظ داخل نفس ملف JSON — ما كاينش إعداد إضافي.
- Blob مكان أمين: كيحوي كلمة مرور الأدمن وبيانات الطلبات. ما تشاركش رمز الوصول ديالو.
- إذا بغيتي ترجع للـ VPS، نفس الكود كيخدم بـ `data/store.json` محلياً ما دام ما كاينش متغيرات Blob.
