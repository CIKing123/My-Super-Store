const GOOGLE_MAPS_API_KEY = 'AIzaSyAVamyyQXuecYqP-WyQsVuNdi5mEwUnSGc';

// Get precise location from IP geolocation (multiple services for redundancy)
export async function getCurrentLocation(): Promise<{ lat: number; lng: number }> {
  console.log('\n\n╔════════════════════════════════════════════════════════╗');
  console.log('║        IP-BASED GEOLOCATION (CLOUDFLARE LEVEL)         ║');
  console.log('╚════════════════════════════════════════════════════════╝\n');

  // Try multiple providers for reliability
  const providers = [
    {
      name: 'ipapi.co',
      url: 'https://ipapi.co/json/',
      parse: (data: any) => ({ lat: data.latitude, lng: data.longitude, city: data.city, region: data.region, country: data.country_name })
    },
    {
      name: 'geolocation-db',
      url: 'https://geolocation-db.com/json/',
      parse: (data: any) => ({ lat: parseFloat(data.latitude), lng: parseFloat(data.longitude), city: data.city, region: data.state, country: data.country_name })
    },
    {
      name: 'ipwho.is',
      url: 'https://ipwho.is/',
      parse: (data: any) => ({ lat: data.latitude, lng: data.longitude, city: data.city, region: data.region, country: data.country_name })
    }
  ];

  for (const provider of providers) {
    try {
      console.log(`[IPGeo] Trying ${provider.name}...`);
      
      const res = await fetch(provider.url, {
        headers: {
          'Accept': 'application/json'
        }
      });
      
      if (!res.ok) {
        console.warn(`[IPGeo] ${provider.name} returned ${res.status}`);
        continue;
      }

      const data = await res.json();
      
      if (!data.latitude || !data.longitude) {
        console.warn(`[IPGeo] ${provider.name} missing coordinates`);
        continue;
      }

      const location = provider.parse(data);

      console.log('╔════════════════════════════════════════════════════════╗');
      console.log('║              ✓ LOCATION FOUND                         ║');
      console.log('╚════════════════════════════════════════════════════════╝');
      console.log(`[IPGeo] Provider:   ${provider.name}`);
      console.log(`[IPGeo] Latitude:   ${location.lat}`);
      console.log(`[IPGeo] Longitude:  ${location.lng}`);
      console.log(`[IPGeo] City:       ${location.city}`);
      console.log(`[IPGeo] Region:     ${location.region}`);
      console.log(`[IPGeo] Country:    ${location.country}\n`);

      return { lat: location.lat, lng: location.lng };
    } catch (error) {
      console.warn(`[IPGeo] ${provider.name} failed:`, error);
      continue;
    }
  }

  // If all providers fail, throw error
  console.error('[IPGeo] ✗ All geolocation providers failed');
  throw new Error('Unable to get location from all providers. Check internet connection.');
}

export async function reverseGeocode(lat: number, lng: number): Promise<{
  line1: string;
  city: string;
  state: string;
  country: string;
  postal_code: string;
}> {
  try {
    console.log('\n╔════════════════════════════════════════════════════════╗');
    console.log('║          REVERSE GEOCODING COORDINATES                ║');
    console.log('╚════════════════════════════════════════════════════════╝');
    console.log(`[GeoAPI] Input: Lat ${lat}, Lng ${lng}\n`);

    const res = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&result_type=street_address|route|locality&language=en&key=${GOOGLE_MAPS_API_KEY}`
    );

    if (!res.ok) {
      throw new Error(`Geocoding API error: ${res.status}`);
    }

    const data = await res.json();

    console.log(`[GeoAPI] API Status: ${data.status}`);
    console.log(`[GeoAPI] Results found: ${data.results.length}`);

    if (data.status === 'ZERO_RESULTS') {
      console.warn('[GeoAPI] No results for these coordinates - using fallback parsing');
      return {
        line1: `${lat.toFixed(5)}, ${lng.toFixed(5)}`,
        city: 'Unknown',
        state: 'Unknown',
        country: 'Nigeria',
        postal_code: '',
      };
    }

    if (data.results.length === 0) {
      throw new Error('No geocoding results');
    }

    // Log top results
    console.log('\n[GeoAPI] Top results:');
    data.results.slice(0, 3).forEach((result: any, idx: number) => {
      console.log(`  ${idx + 1}. ${result.formatted_address}`);
    });

    const result = data.results[0];

    const getPart = (types: string[]) => {
      const component = result.address_components.find((c: any) =>
        types.some(type => c.types.includes(type))
      );
      return component?.long_name || component?.short_name || '';
    };

    const address = {
      line1: result.formatted_address.split(',')[0].trim(),
      city: getPart(['locality', 'administrative_area_level_2', 'administrative_area_level_3']),
      state: getPart(['administrative_area_level_1']),
      country: getPart(['country']),
      postal_code: getPart(['postal_code']),
    };

    console.log('\n[GeoAPI] Extracted Address:');
    console.log(`  Street:  ${address.line1}`);
    console.log(`  City:    ${address.city}`);
    console.log(`  State:   ${address.state}`);
    console.log(`  Country: ${address.country}`);
    console.log(`  Postal:  ${address.postal_code}\n`);

    return address;
  } catch (error) {
    console.error('[GeoAPI] Reverse geocoding error:', error);
    throw error;
  }
}

export async function getAddressFromLocation(): Promise<{
  lat: number;
  lng: number;
  line1: string;
  city: string;
  state: string;
  country: string;
  postal_code: string;
}> {
  try {
    console.log('\n\n');
    console.log('╔════════════════════════════════════════════════════════╗');
    console.log('║         DELIVERY ADDRESS TRACKING - FULL PROCESS       ║');
    console.log('║      Using Cloudflare-Level IP Geolocation Accuracy    ║');
    console.log('╚════════════════════════════════════════════════════════╝\n');

    // Step 1: Get IP-based geolocation
    console.log('STEP 1: Getting precise IP geolocation...');
    const location = await getCurrentLocation();

    // Step 2: Reverse geocode to street address
    console.log('\nSTEP 2: Converting coordinates to street address...');
    const address = await reverseGeocode(location.lat, location.lng);

    const fullAddress = {
      ...location,
      ...address,
    };

    console.log('\n╔════════════════════════════════════════════════════════╗');
    console.log('║         ✓ COMPLETE DELIVERY ADDRESS OBTAINED           ║');
    console.log('╚════════════════════════════════════════════════════════╝');
    console.log('\n📍 PRECISE COORDINATES:');
    console.log(`   Latitude:  ${location.lat}`);
    console.log(`   Longitude: ${location.lng}`);
    console.log('\n📮 FULL ADDRESS:');
    console.log(`   ${fullAddress.line1}`);
    console.log(`   ${fullAddress.city}, ${fullAddress.state}`);
    console.log(`   ${fullAddress.country} ${fullAddress.postal_code}`);
    console.log('\n📦 COMPLETE OBJECT:');
    console.log(fullAddress);
    console.log('\n╚════════════════════════════════════════════════════════╝\n');

    return fullAddress;
  } catch (error) {
    console.error('\n╔════════════════════════════════════════════════════════╗');
    console.error('║         ✗ DELIVERY ADDRESS TRACKING FAILED            ║');
    console.error('╚════════════════════════════════════════════════════════╝');
    console.error('\n❌ ERROR:', error);
    console.error('\n🔧 TROUBLESHOOTING:');
    console.error('   1. Check internet connection');
    console.error('   2. Refresh the page');
    console.error('   3. Try using a different browser');
    console.error('   4. Check if geolocation services are accessible\n');
    console.error('╚════════════════════════════════════════════════════════╝\n');
    throw error;
  }
}
