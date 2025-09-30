import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// 扩展 Leaflet 的 GeoJSON 类型，添加 selectedLayer 属性
declare module 'leaflet' {
    interface GeoJSON {
        selectedLayer?: L.Layer | null;
    }
}

// 地图组件 props
interface MapComponentProps {
    className?: string;
}

const MapComponent: React.FC<MapComponentProps> = ({ className = '' }) => {
    const mapContainerRef = useRef<HTMLDivElement>(null);
    const mapRef = useRef<L.Map | null>(null);
    const geojsonRef = useRef<L.GeoJSON | null>(null);
    const [isMapVisible, setIsMapVisible] = useState(true); // 设置为默认显示按钮

    // 区域编码映射
    const areaCodes = {
        global: null,
        china: null,
        zunyi: 520300,
        yangpu: 310110,
    };

    const defaultStyle = (): L.PathOptions => ({
        fillColor: 'transparent',
        weight: 1,
        opacity: 1,
        color: '#333',
        fillOpacity: 0,
    });

    const highlightStyle = (): L.PathOptions => ({
        fillColor: '#ff0000',
        weight: 2,
        opacity: 1,
        color: '#000',
        fillOpacity: 0.7,
    });

    // 新增：监听地图区域可见性
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                // 当地图区域可见性超过50%时，显示按钮
                setIsMapVisible(entries[0].isIntersecting && entries[0].intersectionRatio > 0.5);
            },
            { threshold: 0.5 } // 可见性阈值设为50%
        );

        if (mapContainerRef.current) {
            observer.observe(mapContainerRef.current);
        }

        return () => {
            if (mapContainerRef.current) {
                observer.unobserve(mapContainerRef.current);
            }
        };
    }, []);

    useEffect(() => {
        if (!mapContainerRef.current) return;

        const map = L.map(mapContainerRef.current, {
            zoomControl: false,
            scrollWheelZoom: false,
            doubleClickZoom: false,
            boxZoom: false,
            attributionControl: false,
        }).setView([35.8617, 104.1954], 4);

        L.tileLayer('https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png', {
            maxZoom: 18,
            noWrap: false,
        }).addTo(map);

        mapRef.current = map;

        const loadGeoJSON = async () => {
            try {
                const response = await fetch('/cn.json');
                if (!response.ok) throw new Error('加载地图数据失败');
                const geoData = await response.json();

                const geojson = L.geoJson(geoData, {
                    style: defaultStyle,
                    onEachFeature: (feature, layer) => {
                        layer.on('mouseover', () => {
                            if (!geojsonRef.current?.selectedLayer) {
                                (layer as L.Path).setStyle({ weight: 2, color: '#666' });
                            }
                        });
                        layer.on('mouseout', () => {
                            if (!geojsonRef.current?.selectedLayer) {
                                geojson.setStyle(defaultStyle);
                            }
                        });
                        (layer as any).feature = feature;
                    },
                }).addTo(map);

                geojson.selectedLayer = null;
                geojsonRef.current = geojson;
            } catch (error) {
                console.error('地图数据加载错误:', error);
            }
        };

        loadGeoJSON();

        return () => {
            if (mapRef.current) {
                mapRef.current.remove();
                mapRef.current = null;
            }
        };
    }, []);

    // 定位按钮
    const handleLocationClick = (area: keyof typeof areaCodes, lat: number, lng: number, zoom: number) => {
        const map = mapRef.current;
        const geojson = geojsonRef.current;
        if (!map || !geojson) return;

        // 重置所有区域样式
        geojson.setStyle(defaultStyle);
        geojson.selectedLayer = null;

        // 高亮目标区域
        if (area !== 'global') {
            const targetCode = areaCodes[area];
            geojson.eachLayer((layer: L.Layer) => {
                const feature = (layer as any).feature;
                if (!feature?.properties?.adcode) return;

                if (area === 'china' || feature.properties.adcode === targetCode) {
                    (layer as L.Path).setStyle(highlightStyle());
                    geojson.selectedLayer = layer;
                }
            });
        }

        // 平滑定位
        map.flyTo([lat, lng], zoom, { duration: 1.2 });

        // 移除所有标记
        map.eachLayer((layer) => {
            if (layer instanceof L.Marker) map.removeLayer(layer);
        });
    };

    return (
        <div
            className={`map-wrapper ${className}`}
            style={{
                width: '100%', // 改为100%而不是100vw
                height: '100vh',
                padding: '5vw',
                backgroundColor: '#000',
                boxSizing: 'border-box',
                overflow: 'hidden',
                position: 'relative', // 添加相对定位，使绝对定位的按钮相对于此容器定位
            }}
        >
            <div
                ref={mapContainerRef}
                style={{
                    width: '100%',
                    height: '100%',
                    backgroundColor: '#fff',
                }}
            />

            {/* 只有当地图可见时才显示按钮 */}
            {isMapVisible && (
                <div
                    style={{
                        position: 'absolute',
                        top: '5vw',
                        left: '5vw',
                        zIndex: 1000,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '10px',
                        // 添加淡入动画
                        animation: 'fadeIn 0.5s ease-out forwards',
                    }}
                >
                    <button
                        onClick={() => handleLocationClick('global', 35.0, 105.0, 2)}
                        style={{
                            padding: '8px 16px',
                            border: 'none',
                            borderRadius: '4px',
                            backgroundColor: '#fff',
                            boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
                            cursor: 'pointer',
                            fontSize: '14px',
                            fontWeight: 500,
                            fontFamily: 'bei, sans-serif',
                        }}
                    >
                        全球
                    </button>
                    <button
                        onClick={() => handleLocationClick('china', 35.8617, 104.1954, 4)}
                        style={{
                            padding: '8px 16px',
                            border: 'none',
                            borderRadius: '4px',
                            backgroundColor: '#fff',
                            boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
                            cursor: 'pointer',
                            fontSize: '14px',
                            fontWeight: 500,
                            fontFamily: 'bei, sans-serif',
                        }}
                    >
                        中国
                    </button>
                    <button
                        onClick={() => handleLocationClick('zunyi', 27.7274, 106.9723, 6)}
                        style={{
                            padding: '8px 16px',
                            border: 'none',
                            borderRadius: '4px',
                            backgroundColor: '#fff',
                            boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
                            cursor: 'pointer',
                            fontSize: '14px',
                            fontWeight: 500,
                            fontFamily: 'bei, sans-serif',
                        }}
                    >
                        遵义
                    </button>
                    <button
                        onClick={() => handleLocationClick('yangpu', 31.2626, 121.5369, 8)}
                        style={{
                            padding: '8px 16px',
                            border: 'none',
                            borderRadius: '4px',
                            backgroundColor: '#fff',
                            boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
                            cursor: 'pointer',
                            fontSize: '14px',
                            fontWeight: 500,
                            fontFamily: 'bei, sans-serif',
                        }}
                    >
                        杨浦
                    </button>
                </div>
            )}
        </div>
    );
};

export default MapComponent;
    