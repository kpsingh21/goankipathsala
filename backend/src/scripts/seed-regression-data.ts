import { PrismaClient, UserRole, Gender, EnrollmentStatus, AttendanceStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function seedRegressionData() {
  console.log('🌱 Starting Regression Test Data Seeder...');

  const schoolSlug = 'saraswati-vidya';
  const schoolName = 'Saraswati Gramin Vidya Mandir';

  // 1. Create or Update Tenant
  const tenant = await prisma.tenant.upsert({
    where: { slug: schoolSlug },
    update: {
      name: schoolName,
      status: 'ACTIVE',
      plan: 'PREMIUM',
      settings: {
        landingConfig: {
          logoUrl: 'https://images.unsplash.com/photo-1594608661623-aa0bd3a69d98?auto=format&fit=crop&w=400&q=80',
          tagline: 'Quality Rural Education & Digital Empowerment',
          aboutText: 'Saraswati Gramin Vidya Mandir is dedicated to delivering world-class, digitally enabled education.',
          principalName: 'Dr. R. K. Sharma',
          contactAddress: 'Village Campus, Near Hatod Road, Indore Dist, MP - 453111',
          contactPhone: '+91 98260 12345',
          contactEmail: 'contact@saraswati.goankipathsala.in',
        },
      },
    },
    create: {
      name: schoolName,
      slug: schoolSlug,
      status: 'ACTIVE',
      plan: 'PREMIUM',
      settings: {
        landingConfig: {
          logoUrl: 'https://images.unsplash.com/photo-1594608661623-aa0bd3a69d98?auto=format&fit=crop&w=400&q=80',
          tagline: 'Quality Rural Education & Digital Empowerment',
          aboutText: 'Saraswati Gramin Vidya Mandir is dedicated to delivering world-class, digitally enabled education.',
          principalName: 'Dr. R. K. Sharma',
          contactAddress: 'Village Campus, Near Hatod Road, Indore Dist, MP - 453111',
          contactPhone: '+91 98260 12345',
          contactEmail: 'contact@saraswati.goankipathsala.in',
        },
      },
    },
  });

  console.log(`✅ Tenant configured: ${tenant.name} (${tenant.slug})`);

  // 2. Academic Year
  const academicYear = await prisma.academicYear.upsert({
    where: {
      tenantId_name: {
        tenantId: tenant.id,
        name: '2026-2027',
      },
    },
    update: { isCurrent: true },
    create: {
      tenantId: tenant.id,
      name: '2026-2027',
      startDate: new Date('2026-04-01'),
      endDate: new Date('2027-03-31'),
      isCurrent: true,
    },
  });

  // 3. Class Grades & Sections
  const classesData = [
    { name: 'Class 6', order: 6 },
    { name: 'Class 7', order: 7 },
    { name: 'Class 8', order: 8 },
  ];

  const sectionsMap: Record<string, string> = {}; // 'Class 6-A' -> sectionId

  for (const c of classesData) {
    const cg = await prisma.classGrade.upsert({
      where: {
        tenantId_name: { tenantId: tenant.id, name: c.name },
      },
      update: { numericalOrder: c.order },
      create: {
        tenantId: tenant.id,
        name: c.name,
        numericalOrder: c.order,
      },
    });

    for (const secName of ['A', 'B']) {
      const sec = await prisma.section.upsert({
        where: {
          tenantId_classGradeId_name: {
            tenantId: tenant.id,
            classGradeId: cg.id,
            name: secName,
          },
        },
        update: {},
        create: {
          tenantId: tenant.id,
          classGradeId: cg.id,
          name: secName,
        },
      });
      sectionsMap[`${c.name}-${secName}`] = sec.id;
    }
  }

  // 4. Create Users (School Admin, Class Teacher, Driver)
  const defaultPasswordHash = await bcrypt.hash('password123', 10);

  // 4a. School Admin
  const adminEmail = 'admin@saraswati.com';
  const adminUser = await prisma.user.upsert({
    where: {
      tenantId_email: { tenantId: tenant.id, email: adminEmail },
    },
    update: { passwordHash: defaultPasswordHash, role: UserRole.SCHOOL_ADMIN },
    create: {
      tenantId: tenant.id,
      email: adminEmail,
      phone: '9876543210',
      passwordHash: defaultPasswordHash,
      role: UserRole.SCHOOL_ADMIN,
    },
  });

  await prisma.staffProfile.upsert({
    where: { userId: adminUser.id },
    update: { fullName: 'Principal R.K. Sharma', designation: 'Headmaster / Admin' },
    create: {
      tenantId: tenant.id,
      userId: adminUser.id,
      fullName: 'Principal R.K. Sharma',
      designation: 'Headmaster / Admin',
      department: 'Administration',
    },
  });

  // 4b. Teacher (Class Teacher for Class 6-A)
  const teacherEmail = 'teacher@saraswati.com';
  const teacherUser = await prisma.user.upsert({
    where: {
      tenantId_email: { tenantId: tenant.id, email: teacherEmail },
    },
    update: { passwordHash: defaultPasswordHash, role: UserRole.CLASS_TEACHER },
    create: {
      tenantId: tenant.id,
      email: teacherEmail,
      phone: '9876543211',
      passwordHash: defaultPasswordHash,
      role: UserRole.CLASS_TEACHER,
    },
  });

  await prisma.staffProfile.upsert({
    where: { userId: teacherUser.id },
    update: { fullName: 'Smt. Sunita Verma', designation: 'Class Teacher (Class 6-A)' },
    create: {
      tenantId: tenant.id,
      userId: teacherUser.id,
      fullName: 'Smt. Sunita Verma',
      designation: 'Class Teacher (Class 6-A)',
      department: 'Science & Maths',
    },
  });

  // Assign Sunita as Class Teacher of Class 6-A
  if (sectionsMap['Class 6-A']) {
    await prisma.section.update({
      where: { id: sectionsMap['Class 6-A'] },
      data: { classTeacherId: teacherUser.id },
    });
  }

  // 4c. Driver
  const driverEmail = 'driver@saraswati.com';
  const driverUser = await prisma.user.upsert({
    where: {
      tenantId_email: { tenantId: tenant.id, email: driverEmail },
    },
    update: { passwordHash: defaultPasswordHash, role: UserRole.DRIVER },
    create: {
      tenantId: tenant.id,
      email: driverEmail,
      phone: '9876543212',
      passwordHash: defaultPasswordHash,
      role: UserRole.DRIVER,
    },
  });

  await prisma.staffProfile.upsert({
    where: { userId: driverUser.id },
    update: { fullName: 'Ramesh Yadav', designation: 'Senior Bus Driver' },
    create: {
      tenantId: tenant.id,
      userId: driverUser.id,
      fullName: 'Ramesh Yadav',
      designation: 'Senior Bus Driver',
      department: 'Transport',
    },
  });

  console.log('✅ Users configured:');
  console.log(`   - School Admin:  ${adminEmail} / password123`);
  console.log(`   - Class Teacher: ${teacherEmail} / password123`);
  console.log(`   - Bus Driver:    ${driverEmail} / password123`);

  // 5. Bus Routes
  const busRoute = await prisma.busRoute.upsert({
    where: {
      tenantId_routeNumber: {
        tenantId: tenant.id,
        routeNumber: 'Route 1 - Hatod Express',
      },
    },
    update: {
      routeName: 'Hatod Express',
      driverName: 'Ramesh Yadav',
      driverPhone: '9876543212',
      driverUserId: driverUser.id,
      vehicleNumber: 'MP-09-FA-4421',
    },
    create: {
      tenantId: tenant.id,
      routeNumber: 'Route 1 - Hatod Express',
      routeName: 'Hatod Express',
      vehicleNumber: 'MP-09-FA-4421',
      driverName: 'Ramesh Yadav',
      driverPhone: '9876543212',
      driverUserId: driverUser.id,
      stops: [
        { name: 'Semliya Chaupal', time: '07:25 AM' },
        { name: 'Hatod Square', time: '07:40 AM' },
        { name: 'Badgonda', time: '07:55 AM' },
        { name: 'School Campus', time: '08:15 AM' },
      ],
    },
  });

  // 6. Notices
  await prisma.notice.createMany({
    data: [
      {
        tenantId: tenant.id,
        title: 'Mid-Term Examinations Timetable Announced',
        content: 'Mid-term examinations will commence from 15th October. Detailed syllabus is shared with class teachers.',
        category: 'EXAMINATION',
        priority: 'HIGH',
        targetAudience: 'ALL',
        isPinned: true,
      },
      {
        tenantId: tenant.id,
        title: 'Annual Sports Day Registration Open',
        content: 'Inter-house kabaddi, athletics sprint, and badminton trials will be held this Saturday.',
        category: 'SPORTS',
        priority: 'NORMAL',
        targetAudience: 'STUDENTS',
        isPinned: false,
      },
    ],
    skipDuplicates: true,
  });

  // 7. Seed 10 Realistic Rural Students
  const sampleStudents = [
    { first: 'Aarav', last: 'Sharma', gender: Gender.MALE, father: 'Mukesh Sharma', phone: '9826111001', village: 'Hatod', cat: 'GENERAL', blood: 'B+' },
    { first: 'Pooja', last: 'Patel', gender: Gender.FEMALE, father: 'Dinesh Patel', phone: '9826111002', village: 'Semliya', cat: 'OBC', blood: 'O+' },
    { first: 'Rahul', last: 'Chouhan', gender: Gender.MALE, father: 'Kailash Chouhan', phone: '9826111003', village: 'Badgonda', cat: 'GENERAL', blood: 'A+' },
    { first: 'Ananya', last: 'Verma', gender: Gender.FEMALE, father: 'Rajendra Verma', phone: '9826111004', village: 'Hatod', cat: 'SC', blood: 'AB+' },
    { first: 'Devansh', last: 'Singh', gender: Gender.MALE, father: 'Sanjay Singh', phone: '9826111005', village: 'Pal Khedi', cat: 'GENERAL', blood: 'B+' },
    { first: 'Roshni', last: 'Solanki', gender: Gender.FEMALE, father: 'Bharat Solanki', phone: '9826111006', village: 'Semliya', cat: 'ST', blood: 'O+' },
    { first: 'Aditya', last: 'Mishra', gender: Gender.MALE, father: 'Kamlesh Mishra', phone: '9826111007', village: 'Hatod', cat: 'GENERAL', blood: 'B-' },
    { first: 'Kajal', last: 'Gupta', gender: Gender.FEMALE, father: 'Satish Gupta', phone: '9826111008', village: 'Sanwer', cat: 'OBC', blood: 'A+' },
    { first: 'Mohit', last: 'Rathore', gender: Gender.MALE, father: 'Mahendra Rathore', phone: '9826111009', village: 'Badgonda', cat: 'GENERAL', blood: 'O-' },
    { first: 'Priya', last: 'Joshi', gender: Gender.FEMALE, father: 'Govind Joshi', phone: '9826111010', village: 'Hatod', cat: 'GENERAL', blood: 'AB-' },
  ];

  const targetSectionId = sectionsMap['Class 6-A'];

  for (let i = 0; i < sampleStudents.length; i++) {
    const s = sampleStudents[i];
    const rollNo = i + 1;
    const admissionNo = `ADM-2026-${1000 + rollNo}`;
    const studentEmail = `student${rollNo}@saraswati.com`;

    // Create student user
    const sUser = await prisma.user.upsert({
      where: {
        tenantId_email: { tenantId: tenant.id, email: studentEmail },
      },
      update: { role: UserRole.STUDENT },
      create: {
        tenantId: tenant.id,
        email: studentEmail,
        phone: s.phone,
        passwordHash: defaultPasswordHash,
        role: UserRole.STUDENT,
      },
    });

    // Create student profile
    const sProfile = await prisma.studentProfile.upsert({
      where: {
        tenantId_admissionNumber: {
          tenantId: tenant.id,
          admissionNumber: admissionNo,
        },
      },
      update: {
        firstName: s.first,
        lastName: s.last,
        fatherName: s.father,
        parentPhone: s.phone,
        villageCity: s.village,
        category: s.cat,
        bloodGroup: s.blood,
      },
      create: {
        tenantId: tenant.id,
        userId: sUser.id,
        admissionNumber: admissionNo,
        firstName: s.first,
        lastName: s.last,
        dob: new Date('2014-07-15'),
        gender: s.gender,
        fatherName: s.father,
        motherName: 'Shanti Devi',
        parentPhone: s.phone,
        guardianOccupation: 'Agriculture & Farming',
        category: s.cat,
        bloodGroup: s.blood,
        villageCity: s.village,
        pincode: '453111',
        addressText: `Near Gram Panchayat, Village ${s.village}`,
      },
    });

    // Enroll in Class 6-A
    if (targetSectionId) {
      await prisma.studentEnrollment.upsert({
        where: {
          tenantId_studentId_academicYearId: {
            tenantId: tenant.id,
            studentId: sProfile.id,
            academicYearId: academicYear.id,
          },
        },
        update: {
          sectionId: targetSectionId,
          rollNumber: rollNo,
        },
        create: {
          tenantId: tenant.id,
          studentId: sProfile.id,
          academicYearId: academicYear.id,
          sectionId: targetSectionId,
          rollNumber: rollNo,
          status: EnrollmentStatus.ENROLLED,
        },
      });
    }
  }

  console.log(`✅ Seeded ${sampleStudents.length} students enrolled in Class 6-A.`);
  console.log('🎉 Regression Test Data Seeder completed successfully!');
}

seedRegressionData()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
