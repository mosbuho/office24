import React, { useCallback, useEffect, useRef, useState } from "react";
import BookingItem from "../../components/member/BookingItem";
import "../../styles/pages/member/MemberBooking.css";
import { getNo } from "../../utils/auth";
import axios from "../../utils/axiosConfig";

const useIntersectionObserver = (callback, options = {}) => {
    const ref = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) callback();
        }, options);

        if (ref.current) observer.observe(ref.current);
        return () => {
            if (ref.current) observer.unobserve(ref.current);
        };
    }, [callback, options]);

    return ref;
};

const ITEMS_PER_PAGE = 10;

function MemberRefund() {
    const [isLoading, setIsLoading] = useState(false);
    const [refundsState, setRefundsState] = useState({
        data: [],
        page: 1,
        hasMore: true,
    });

    const no = getNo();

    const fetchRefunds = useCallback(async (page) => {
        try {
            const response = await axios.get(`/member/${no}/refunds`, {
                params: { page, limit: ITEMS_PER_PAGE },
            });
            return response.data;
        } catch {
            return null;
        }
    }, [no]);

    const loadRefunds = useCallback(async (loadMore = false) => {
        if (isLoading) return;

        const currentPage = loadMore ? refundsState.page + 1 : 1;
        setIsLoading(true);

        const response = await fetchRefunds(currentPage);

        if (response?.refunds) {
            setRefundsState((prevState) => ({
                data: loadMore ? [...prevState.data, ...response.refunds] : response.refunds,
                page: currentPage,
                hasMore: response.refunds.length === ITEMS_PER_PAGE,
            }));
        } else {
            setRefundsState((prevState) => ({
                ...prevState,
                hasMore: false,
            }));
        }

        setIsLoading(false);
    }, [isLoading, refundsState, fetchRefunds]);

    useEffect(() => {
        if (refundsState.data.length === 0 && refundsState.hasMore) {
            loadRefunds();
        }
    }, [refundsState, loadRefunds]);

    const loadMoreRef = useIntersectionObserver(() => {
        if (refundsState.hasMore && !isLoading) {
            loadRefunds(true);
        }
    });

    const handleRefundCancel = useCallback((refundNo) => {
        setRefundsState((prevState) => ({
            ...prevState,
            data: prevState.data.filter((refund) => refund.NO !== refundNo),
        }));
    }, []);

    const renderRefundItem = useCallback((item) => (
        <BookingItem
            key={item.NO}
            item={item}
            onCancel={handleRefundCancel}
            refund={true}
        />
    ), [handleRefundCancel]);

    const renderRefunds = () => {
        if (refundsState.data.length === 0 && !refundsState.hasMore) {
            return <div>취소 내역이 존재하지 않습니다.</div>;
        }

        return (
            <>
                {refundsState.data.map(renderRefundItem)}
                {refundsState.hasMore && <div ref={loadMoreRef}></div>}
                {isLoading && <></>}
            </>
        );
    };

    return (
        <>
            <h2>취소 내역</h2>
            {renderRefunds()}
        </>
    );
}

export default MemberRefund;
