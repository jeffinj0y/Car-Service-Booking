import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './ServiceCenterSelection.css';

const ServiceCenterSelection = () => {
  const [serviceCenters, setServiceCenters] = useState([]);
  const [filteredCenters, setFilteredCenters] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedCenter, setExpandedCenter] = useState(null);
  const nav = useNavigate();

  useEffect(() => {
    const fetchServiceCenters = async () => {
      try {
        const response = await axios.get('http://localhost:5002/api/service-centers/Sget');
        const allCenters = response.data.filter(center => center.status === 'approved');

        // Group services by category for each center
        const centersWithGroupedServices = allCenters.map(center => {
          const servicesByCategory = center.services?.reduce((acc, service) => {
            if (!acc[service.categoryId]) {
              acc[service.categoryId] = {
                categoryName: service.categoryName,
                subcategories: []
              };
            }
            acc[service.categoryId].subcategories.push({
              id: service.subcategoryId,
              name: service.subcategoryName,
              duration: service.duration,
              price: service.price,
            });
            return acc;
          }, {});
console.log("Grouped Services", center.groupedServices);
console.log("service by category", servicesByCategory);
          return {
            ...center,
            groupedServices: servicesByCategory ? Object.values(servicesByCategory) : []
          };
        });

        setServiceCenters(centersWithGroupedServices);
        setFilteredCenters(centersWithGroupedServices);

        const uniqueDistricts = [...new Set(allCenters.map(center => center.address?.district))].filter(Boolean);
        const uniqueCities = [...new Set(allCenters.map(center => center.address?.city))].filter(Boolean);

        setDistricts(uniqueDistricts);
        setCities(uniqueCities);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchServiceCenters();
  }, []);

  useEffect(() => {
    let filtered = serviceCenters;

    if (selectedDistrict) {
      filtered = filtered.filter(center =>
        center.address?.district === selectedDistrict
      );
    }

    if (selectedCity) {
      filtered = filtered.filter(center =>
        center.address?.city === selectedCity
      );
    }

    setFilteredCenters(filtered);
  }, [selectedDistrict, selectedCity, serviceCenters]);

  const resetFilters = () => {
    setSelectedDistrict('');
    setSelectedCity('');
    setFilteredCenters(serviceCenters);
  };

  if (loading) return <div className="loading">Loading service centers...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  const toggleCenterExpand = (centerId) => {
    setExpandedCenter(expandedCenter === centerId ? null : centerId);
  };

  if (loading) return <div className="loading">Loading service centers...</div>;
  if (error) return <div className="error">Error: {error}</div>;
  console.log("serviceCenters", filteredCenters);

  return (
    <div className="service-center-selection">
      <h1>Find Service Centers</h1>

      <div className="filters">
        <div className="filter-group">
          <label htmlFor="district">District:</label>
          <select
            id="district"
            value={selectedDistrict}
            onChange={(e) => setSelectedDistrict(e.target.value)}
          >
            <option value="">All Districts</option>
            {districts.map(district => (
              <option key={district} value={district}>{district}</option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="city">City:</label>
          <select
            id="city"
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            disabled={!selectedDistrict}
          >
            <option value="">All Cities</option>
            {cities
              .filter(city => {
                if (!selectedDistrict) return true;
                const centersInDistrict = serviceCenters.filter(
                  center => center.address?.district === selectedDistrict
                );
                return centersInDistrict.some(center => center.address?.city === city);
              })
              .map(city => (
                <option key={city} value={city}>{city}</option>
              ))}
          </select>
        </div>

        <button onClick={resetFilters} className="reset-btn">
          Reset Filters
        </button>
      </div>

      <div className="results-count">
        {filteredCenters.length} service centers found
      </div>

      <div className="service-centers-grid">
        {filteredCenters.map(center => (
          <div key={center._id} className="service-center-card">
            <div className="card-header">
              <h2>{center.name}</h2>
            </div>

            <div className="card-body">
              <div className="contact-info">
                <p>📞 {center.phone}</p>
                <p>✉️ {center.email}</p>
              </div>

              <div className="address">
                <h3>Address:</h3>
                <p>
                  {center.address?.street && `${center.address.street}, `}
                  {center.address?.city && `${center.address.city}, `}
                  {center.address?.state && `${center.address.state} `}
                  {center.address?.zipCode && center.address.zipCode}
                </p>
              </div>

              <div className="services">
                <h3>Services Offered:</h3>

                {expandedCenter === center._id ? (
                  <div className="expanded-services">
                    {center.groupedServices?.map((category, catIndex) => (
                      <div key={catIndex} className="service-category">
                        <h4>{category.categoryName}</h4>
                        <ul className="subcategory-list">
                          {category.subcategories.map((subcat, subIndex) => (
                            <li key={subIndex}>
                              <span className="subcategory-name">{subcat.name}</span>
                             <span className='subcategory-duration'>
  {subcat.duration ? `${subcat.duration} mins` : 'N/A'}
</span>
                              <span className="subcategory-price">₹{subcat.price}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                    <button
                      className="view-less-btn"
                      onClick={() => toggleCenterExpand(center._id)}
                    >
                      Show Less
                    </button>
                  </div>
                ) : (
                  <>
                    <ul className="service-preview">
                      {center.groupedServices?.flatMap(category =>
                        category.subcategories.slice(0, 2).map((subcat, index) => (
                          <li key={`${category.categoryName}-${index}`}>
                            {subcat.name} ({subcat.duration},₹{subcat.price})
                          </li>
                        ))
                      )}
                    </ul>
                    {center.groupedServices?.flatMap(c => c.subcategories).length > 2 && (
                      <button
                        className="view-more-btn"
                        onClick={() => toggleCenterExpand(center._id)}
                      >
                        +{center.groupedServices.flatMap(c => c.subcategories).length - 2} more services
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>

            <div className="card-footer">
              <button
                className="book-btn"
                onClick={() => nav('/bookings', { state: { selectedCenterId: center._id } })}
              >
                Book Service Appointment
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredCenters.length === 0 && (
        <div className="no-results">
          No service centers found matching your criteria.
        </div>
      )}
    </div>
  );
};

export default ServiceCenterSelection;