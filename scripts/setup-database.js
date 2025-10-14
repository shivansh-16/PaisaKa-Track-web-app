const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://jtntqpeibauiqelkpzog.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const systemCategories = [
  { name_en: 'Food', name_hi: 'भोजन', icon: '🍕' },
  { name_en: 'Transport', name_hi: 'यातायात', icon: '🚗' },
  { name_en: 'Tea/Coffee', name_hi: 'चाय/कॉफी', icon: '☕' },
  { name_en: 'Entertainment', name_hi: 'मनोरंजन', icon: '🎬' },
  { name_en: 'Medical', name_hi: 'चिकित्सा', icon: '🏥' },
  { name_en: 'Shopping', name_hi: 'खरीदारी', icon: '🛒' },
  { name_en: 'Clothes', name_hi: 'कपड़े', icon: '👕' },
  { name_en: 'Bills', name_hi: 'बिल', icon: '💡' },
  { name_en: 'Education', name_hi: 'शिक्षा', icon: '🎓' },
  { name_en: 'Rent', name_hi: 'किराया', icon: '🏠' },
  { name_en: 'Groceries', name_hi: 'किराना', icon: '🛒' },
  { name_en: 'Fuel', name_hi: 'ईंधन', icon: '⛽' },
  { name_en: 'Mobile Recharge', name_hi: 'मोबाइल रिचार्ज', icon: '📱' },
  { name_en: 'Internet', name_hi: 'इंटरनेट', icon: '🌐' },
  { name_en: 'Electricity', name_hi: 'बिजली', icon: '💡' },
  { name_en: 'Water', name_hi: 'पानी', icon: '💧' },
  { name_en: 'Gas', name_hi: 'गैस', icon: '🔥' },
  { name_en: 'Insurance', name_hi: 'बीमा', icon: '🛡️' },
  { name_en: 'Investment', name_hi: 'निवेश', icon: '📈' },
  { name_en: 'Salary', name_hi: 'वेतन', icon: '💰' },
  { name_en: 'Gift', name_hi: 'उपहार', icon: '🎁' },
  { name_en: 'Other', name_hi: 'अन्य', icon: '📝' }
];

async function setupDatabase() {
  console.log('🚀 Starting database setup...\n');

  // Check if system categories already exist
  console.log('📊 Checking system categories...');
  const { data: existingCategories, error: checkError } = await supabase
    .from('categories')
    .select('id')
    .eq('is_system', true)
    .limit(1);

  if (checkError) {
    console.error('❌ Error checking categories:', checkError.message);
    return;
  }

  if (existingCategories && existingCategories.length > 0) {
    console.log('✅ System categories already exist, skipping...\n');
  } else {
    console.log('📝 Inserting system categories...');
    
    // Insert categories one by one to handle conflicts
    let inserted = 0;
    for (const category of systemCategories) {
      const { error } = await supabase
        .from('categories')
        .insert({
          owner_id: null,
          name_en: category.name_en,
          name_hi: category.name_hi,
          icon: category.icon,
          is_system: true
        });

      if (error) {
        if (error.code !== '23505') { // Ignore duplicate key errors
          console.error(`  ❌ Failed to insert ${category.name_en}:`, error.message);
        }
      } else {
        inserted++;
      }
    }
    
    console.log(`✅ Inserted ${inserted} system categories\n`);
  }

  // Verify setup
  console.log('🔍 Verifying database setup...');
  const { data: categories, error: verifyError } = await supabase
    .from('categories')
    .select('*')
    .eq('is_system', true);

  if (verifyError) {
    console.error('❌ Error verifying:', verifyError.message);
  } else {
    console.log(`✅ Total system categories: ${categories.length}`);
    console.log('Sample categories:');
    categories.slice(0, 5).forEach(cat => {
      console.log(`  ${cat.icon} ${cat.name_en} / ${cat.name_hi}`);
    });
  }

  console.log('\n✨ Database setup complete!');
}

setupDatabase().catch(console.error);
